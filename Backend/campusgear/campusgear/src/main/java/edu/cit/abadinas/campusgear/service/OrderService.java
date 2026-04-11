package edu.cit.abadinas.campusgear.service;

import edu.cit.abadinas.campusgear.dto.OrderRequest;
import edu.cit.abadinas.campusgear.dto.OrderResponse;
import edu.cit.abadinas.campusgear.entity.*;
import edu.cit.abadinas.campusgear.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.Year;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public OrderService(OrderRepository orderRepository, OrderItemRepository orderItemRepository,
                        ProductRepository productRepository, UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public OrderResponse createOrder(OrderRequest request, String email) {
        User renter = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ProductService.ResourceNotFoundException("Product not found"));

        if (product.getStatus() != Product.ProductStatus.AVAILABLE) {
            throw new ProductUnavailableException("This equipment is not available for rental");
        }

        if (product.getUser().getId().equals(renter.getId())) {
            throw new InvalidBookingException("You cannot rent your own equipment");
        }

        if (request.getStartDate().isBefore(LocalDate.now())) {
            throw new InvalidBookingException("Start date cannot be in the past");
        }
        if (request.getEndDate().isBefore(request.getStartDate()) || request.getEndDate().isEqual(request.getStartDate())) {
            throw new InvalidBookingException("End date must be after start date");
        }

        long totalDays = ChronoUnit.DAYS.between(request.getStartDate(), request.getEndDate());
        int qty = (request.getQuantity() != null && request.getQuantity() > 0) ? request.getQuantity() : 1;
        BigDecimal itemTotal = product.getPrice().multiply(BigDecimal.valueOf(totalDays)).multiply(BigDecimal.valueOf(qty));
        BigDecimal serviceFee = itemTotal.multiply(new BigDecimal("0.05")).setScale(2, RoundingMode.HALF_UP);
        BigDecimal total = itemTotal.add(serviceFee);

        String orderNumber = generateOrderNumber();
        User lender = product.getUser();
        String lenderName = lender.getFirstname() + " " + lender.getLastname().charAt(0) + ".";

        Order order = Order.builder()
                .orderNumber(orderNumber)
                .user(renter)
                .total(total)
                .status(Order.OrderStatus.CONFIRMED)
                .shippingAddress(request.getShippingAddress())
                .paymentMethod(request.getPaymentMethod())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .build();

        if (request.getCardLastFour() != null && !request.getCardLastFour().isEmpty()) {
            order.setProviderTxnId("SANDBOX-PAY-" + System.currentTimeMillis());
        }

        order = orderRepository.save(order);

        OrderItem orderItem = OrderItem.builder()
                .order(order)
                .product(product)
                .productName(product.getName())
                .quantity(qty)
                .price(product.getPrice())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .totalDays((int) totalDays)
                .build();

        orderItemRepository.save(orderItem);

        product.setStatus(Product.ProductStatus.RENTED);
        productRepository.save(product);

        return toResponse(order, List.of(orderItem), lenderName);
    }

    public List<OrderResponse> getMyRentals(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(order -> {
                    List<OrderItem> items = orderItemRepository.findByOrderId(order.getId());
                    String lenderName = "";
                    if (!items.isEmpty()) {
                        User lender = items.get(0).getProduct().getUser();
                        lenderName = lender.getFirstname() + " " + lender.getLastname().charAt(0) + ".";
                    }
                    return toResponse(order, items, lenderName);
                })
                .collect(Collectors.toList());
    }

    public List<OrderResponse> getMyLendings(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return orderRepository.findByProductUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(order -> {
                    List<OrderItem> items = orderItemRepository.findByOrderId(order.getId());
                    return toResponse(order, items, user.getFirstname() + " " + user.getLastname().charAt(0) + ".");
                })
                .collect(Collectors.toList());
    }

    public OrderResponse getById(Long id, String email) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ProductService.ResourceNotFoundException("Order not found"));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<OrderItem> items = orderItemRepository.findByOrderId(order.getId());

        boolean isRenter = order.getUser().getId().equals(user.getId());
        boolean isLender = items.stream().anyMatch(i -> i.getProduct().getUser().getId().equals(user.getId()));
        if (!isRenter && !isLender) {
            throw new ProductService.UnauthorizedAccessException("You don't have access to this order");
        }

        String lenderName = "";
        if (!items.isEmpty()) {
            User lender = items.get(0).getProduct().getUser();
            lenderName = lender.getFirstname() + " " + lender.getLastname().charAt(0) + ".";
        }

        return toResponse(order, items, lenderName);
    }

    @Transactional
    public OrderResponse cancelOrder(Long id, String email) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ProductService.ResourceNotFoundException("Order not found"));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!order.getUser().getId().equals(user.getId())) {
            throw new ProductService.UnauthorizedAccessException("You can only cancel your own orders");
        }

        if (order.getStatus() == Order.OrderStatus.CANCELLED || order.getStatus() == Order.OrderStatus.COMPLETED) {
            throw new InvalidBookingException("This order cannot be cancelled");
        }

        order.setStatus(Order.OrderStatus.CANCELLED);
        orderRepository.save(order);

        List<OrderItem> items = orderItemRepository.findByOrderId(order.getId());
        for (OrderItem item : items) {
            Product product = item.getProduct();
            product.setStatus(Product.ProductStatus.AVAILABLE);
            productRepository.save(product);
        }

        String lenderName = "";
        if (!items.isEmpty()) {
            User lender = items.get(0).getProduct().getUser();
            lenderName = lender.getFirstname() + " " + lender.getLastname().charAt(0) + ".";
        }

        return toResponse(order, items, lenderName);
    }

    public long countUserRentals(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return orderRepository.countByUserId(user.getId());
    }

    private String generateOrderNumber() {
        int year = Year.now().getValue();
        int seq = (int) (Math.random() * 9000) + 1000;
        return "#CG-" + year + "-" + String.format("%04d", seq);
    }

    private OrderResponse toResponse(Order order, List<OrderItem> items, String lenderName) {
        List<OrderResponse.OrderItemResponse> itemResponses = items.stream().map(item -> {
            Product p = item.getProduct();
            return OrderResponse.OrderItemResponse.builder()
                    .id(item.getId())
                    .productId(p.getId())
                    .productName(item.getProductName())
                    .productImageUrl(p.getImageUrl())
                    .productCategory(p.getCategory())
                    .quantity(item.getQuantity())
                    .price(item.getPrice())
                    .startDate(item.getStartDate())
                    .endDate(item.getEndDate())
                    .totalDays(item.getTotalDays())
                    .listerName(lenderName)
                    .build();
        }).collect(Collectors.toList());

        return OrderResponse.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .total(order.getTotal())
                .status(order.getStatus().name())
                .shippingAddress(order.getShippingAddress())
                .paymentMethod(order.getPaymentMethod())
                .startDate(order.getStartDate())
                .endDate(order.getEndDate())
                .createdAt(order.getCreatedAt())
                .items(itemResponses)
                .build();
    }

    public static class ProductUnavailableException extends RuntimeException {
        public ProductUnavailableException(String message) {
            super(message);
        }
    }

    public static class InvalidBookingException extends RuntimeException {
        public InvalidBookingException(String message) {
            super(message);
        }
    }
}
