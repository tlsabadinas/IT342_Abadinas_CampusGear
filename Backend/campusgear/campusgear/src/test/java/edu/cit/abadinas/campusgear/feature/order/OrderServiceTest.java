package edu.cit.abadinas.campusgear.feature.order;

import edu.cit.abadinas.campusgear.feature.product.ResourceNotFoundException;
import edu.cit.abadinas.campusgear.feature.product.UnauthorizedAccessException;
import edu.cit.abadinas.campusgear.shared.entity.*;
import edu.cit.abadinas.campusgear.shared.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("OrderService Unit Tests")
class OrderServiceTest {

    @Mock private OrderRepository orderRepository;
    @Mock private OrderItemRepository orderItemRepository;
    @Mock private ProductRepository productRepository;
    @Mock private UserRepository userRepository;

    @InjectMocks
    private OrderService orderService;

    private User renter;
    private User lender;
    private Product availableProduct;
    private Order confirmedOrder;
    private OrderItem orderItem;
    private OrderRequest orderRequest;

    @BeforeEach
    void setUp() {
        lender = User.builder()
                .id(1L).email("lender@example.com")
                .firstname("Alice").lastname("Smith")
                .role(User.Role.ROLE_USER).build();

        renter = User.builder()
                .id(2L).email("renter@example.com")
                .firstname("Bob").lastname("Jones")
                .role(User.Role.ROLE_USER).build();

        availableProduct = Product.builder()
                .id(10L).user(lender).name("Camera Kit")
                .price(new BigDecimal("100.00")).stock(1)
                .category("Photography")
                .status(Product.ProductStatus.AVAILABLE).build();

        confirmedOrder = Order.builder()
                .id(100L).orderNumber("#CG-2026-1234")
                .user(renter).total(new BigDecimal("630.00"))
                .status(Order.OrderStatus.CONFIRMED)
                .startDate(LocalDate.now().plusDays(1))
                .endDate(LocalDate.now().plusDays(7))
                .paymentMethod("CARD").build();

        orderItem = OrderItem.builder()
                .id(1L).order(confirmedOrder).product(availableProduct)
                .productName("Camera Kit").quantity(1)
                .price(new BigDecimal("100.00"))
                .startDate(LocalDate.now().plusDays(1))
                .endDate(LocalDate.now().plusDays(7))
                .totalDays(6).build();

        orderRequest = OrderRequest.builder()
                .productId(10L)
                .startDate(LocalDate.now().plusDays(1))
                .endDate(LocalDate.now().plusDays(7))
                .paymentMethod("CARD")
                .shippingAddress("123 Test St")
                .quantity(1).build();
    }

    // ─── CREATE ORDER ────────────────────────────────────────────────────────────

    @Test
    @DisplayName("createOrder: should create order and mark product as RENTED")
    void createOrder_success() {
        when(userRepository.findByEmail("renter@example.com")).thenReturn(Optional.of(renter));
        when(productRepository.findById(10L)).thenReturn(Optional.of(availableProduct));
        when(orderRepository.save(any(Order.class))).thenReturn(confirmedOrder);
        when(orderItemRepository.save(any(OrderItem.class))).thenReturn(orderItem);
        when(productRepository.save(any(Product.class))).thenReturn(availableProduct);

        OrderResponse response = orderService.createOrder(orderRequest, "renter@example.com");

        assertThat(response).isNotNull();
        assertThat(response.getStatus()).isEqualTo("CONFIRMED");
        verify(productRepository).save(argThat(p -> p.getStatus() == Product.ProductStatus.RENTED));
    }

    @Test
    @DisplayName("createOrder: should throw ProductUnavailableException when product is RENTED")
    void createOrder_productUnavailable_throws() {
        availableProduct.setStatus(Product.ProductStatus.RENTED);
        when(userRepository.findByEmail("renter@example.com")).thenReturn(Optional.of(renter));
        when(productRepository.findById(10L)).thenReturn(Optional.of(availableProduct));

        assertThatThrownBy(() -> orderService.createOrder(orderRequest, "renter@example.com"))
                .isInstanceOf(ProductUnavailableException.class)
                .hasMessageContaining("not available");
    }

    @Test
    @DisplayName("createOrder: should throw InvalidBookingException when start date is in the past")
    void createOrder_pastStartDate_throws() {
        orderRequest.setStartDate(LocalDate.now().minusDays(1));
        orderRequest.setEndDate(LocalDate.now().plusDays(2));

        when(userRepository.findByEmail("renter@example.com")).thenReturn(Optional.of(renter));
        when(productRepository.findById(10L)).thenReturn(Optional.of(availableProduct));

        assertThatThrownBy(() -> orderService.createOrder(orderRequest, "renter@example.com"))
                .isInstanceOf(InvalidBookingException.class)
                .hasMessageContaining("past");
    }

    @Test
    @DisplayName("createOrder: should throw InvalidBookingException when end date is not after start date")
    void createOrder_invalidDateRange_throws() {
        orderRequest.setStartDate(LocalDate.now().plusDays(3));
        orderRequest.setEndDate(LocalDate.now().plusDays(1));

        when(userRepository.findByEmail("renter@example.com")).thenReturn(Optional.of(renter));
        when(productRepository.findById(10L)).thenReturn(Optional.of(availableProduct));

        assertThatThrownBy(() -> orderService.createOrder(orderRequest, "renter@example.com"))
                .isInstanceOf(InvalidBookingException.class)
                .hasMessageContaining("after start date");
    }

    // ─── CANCEL ORDER ────────────────────────────────────────────────────────────

    @Test
    @DisplayName("cancelOrder: should set status CANCELLED and restore product availability")
    void cancelOrder_success() {
        when(orderRepository.findById(100L)).thenReturn(Optional.of(confirmedOrder));
        when(userRepository.findByEmail("renter@example.com")).thenReturn(Optional.of(renter));
        when(orderRepository.save(any(Order.class))).thenReturn(confirmedOrder);
        when(orderItemRepository.findByOrderId(100L)).thenReturn(List.of(orderItem));
        when(productRepository.save(any(Product.class))).thenReturn(availableProduct);

        OrderResponse response = orderService.cancelOrder(100L, "renter@example.com");

        assertThat(response).isNotNull();
        verify(orderRepository).save(argThat(o -> o.getStatus() == Order.OrderStatus.CANCELLED));
        verify(productRepository).save(argThat(p -> p.getStatus() == Product.ProductStatus.AVAILABLE));
    }

    @Test
    @DisplayName("cancelOrder: should throw UnauthorizedAccessException when non-renter tries to cancel")
    void cancelOrder_nonRenter_throws() {
        when(orderRepository.findById(100L)).thenReturn(Optional.of(confirmedOrder));
        when(userRepository.findByEmail("lender@example.com")).thenReturn(Optional.of(lender));

        assertThatThrownBy(() -> orderService.cancelOrder(100L, "lender@example.com"))
                .isInstanceOf(UnauthorizedAccessException.class)
                .hasMessageContaining("cancel your own");
    }

    @Test
    @DisplayName("cancelOrder: should throw InvalidBookingException when order is already CANCELLED")
    void cancelOrder_alreadyCancelled_throws() {
        confirmedOrder.setStatus(Order.OrderStatus.CANCELLED);
        when(orderRepository.findById(100L)).thenReturn(Optional.of(confirmedOrder));
        when(userRepository.findByEmail("renter@example.com")).thenReturn(Optional.of(renter));

        assertThatThrownBy(() -> orderService.cancelOrder(100L, "renter@example.com"))
                .isInstanceOf(InvalidBookingException.class)
                .hasMessageContaining("cannot be cancelled");
    }

    @Test
    @DisplayName("cancelOrder: should throw InvalidBookingException when order is COMPLETED")
    void cancelOrder_completed_throws() {
        confirmedOrder.setStatus(Order.OrderStatus.COMPLETED);
        when(orderRepository.findById(100L)).thenReturn(Optional.of(confirmedOrder));
        when(userRepository.findByEmail("renter@example.com")).thenReturn(Optional.of(renter));

        assertThatThrownBy(() -> orderService.cancelOrder(100L, "renter@example.com"))
                .isInstanceOf(InvalidBookingException.class);
    }

    // ─── GET MY RENTALS ──────────────────────────────────────────────────────────

    @Test
    @DisplayName("getMyRentals: should return list of user's rental orders")
    void getMyRentals_returnsList() {
        when(userRepository.findByEmail("renter@example.com")).thenReturn(Optional.of(renter));
        when(orderRepository.findByUserIdOrderByCreatedAtDesc(2L)).thenReturn(List.of(confirmedOrder));
        when(orderItemRepository.findByOrderId(100L)).thenReturn(List.of(orderItem));

        List<OrderResponse> result = orderService.getMyRentals("renter@example.com");

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getOrderNumber()).isEqualTo("#CG-2026-1234");
    }

    // ─── GET BY ID ───────────────────────────────────────────────────────────────

    @Test
    @DisplayName("getById: should throw ResourceNotFoundException for unknown order")
    void getById_notFound_throws() {
        when(orderRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> orderService.getById(999L, "renter@example.com"))
                .isInstanceOf(ResourceNotFoundException.class);
    }
}
