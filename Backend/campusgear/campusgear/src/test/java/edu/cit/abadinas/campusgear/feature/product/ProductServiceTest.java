package edu.cit.abadinas.campusgear.feature.product;

import edu.cit.abadinas.campusgear.shared.entity.Product;
import edu.cit.abadinas.campusgear.shared.entity.User;
import edu.cit.abadinas.campusgear.shared.repository.ProductRepository;
import edu.cit.abadinas.campusgear.shared.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("ProductService Unit Tests")
class ProductServiceTest {

    @Mock private ProductRepository productRepository;
    @Mock private UserRepository userRepository;

    @InjectMocks
    private ProductService productService;

    private User owner;
    private User otherUser;
    private Product availableProduct;
    private ProductRequest productRequest;

    @BeforeEach
    void setUp() {
        owner = User.builder()
                .id(1L).email("owner@example.com")
                .firstname("Alice").lastname("Smith")
                .role(User.Role.ROLE_USER).build();

        otherUser = User.builder()
                .id(2L).email("other@example.com")
                .firstname("Bob").lastname("Jones")
                .role(User.Role.ROLE_USER).build();

        availableProduct = Product.builder()
                .id(10L).user(owner).name("Tripod Stand")
                .description("Heavy-duty tripod").price(new BigDecimal("50.00"))
                .stock(1).category("Photography")
                .status(Product.ProductStatus.AVAILABLE).build();

        productRequest = ProductRequest.builder()
                .name("Tripod Stand").description("Heavy-duty tripod")
                .price(new BigDecimal("50.00")).stock(1)
                .category("Photography").build();
    }

    // ─── GET ALL AVAILABLE ───────────────────────────────────────────────────────

    @Test
    @DisplayName("getAllAvailable: should return list of available products")
    void getAllAvailable_returnsList() {
        when(productRepository.findByStatusOrderByCreatedAtDesc(Product.ProductStatus.AVAILABLE))
                .thenReturn(List.of(availableProduct));

        List<ProductResponse> result = productService.getAllAvailable();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getName()).isEqualTo("Tripod Stand");
        assertThat(result.get(0).getStatus()).isEqualTo("AVAILABLE");
    }

    @Test
    @DisplayName("getAllAvailable: should return empty list when no products available")
    void getAllAvailable_empty() {
        when(productRepository.findByStatusOrderByCreatedAtDesc(Product.ProductStatus.AVAILABLE))
                .thenReturn(List.of());

        List<ProductResponse> result = productService.getAllAvailable();

        assertThat(result).isEmpty();
    }

    // ─── GET BY ID ───────────────────────────────────────────────────────────────

    @Test
    @DisplayName("getById: should return product for valid ID")
    void getById_success() {
        when(productRepository.findById(10L)).thenReturn(Optional.of(availableProduct));

        ProductResponse result = productService.getById(10L);

        assertThat(result.getId()).isEqualTo(10L);
        assertThat(result.getName()).isEqualTo("Tripod Stand");
    }

    @Test
    @DisplayName("getById: should throw ResourceNotFoundException for unknown ID")
    void getById_notFound_throws() {
        when(productRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> productService.getById(99L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("99");
    }

    // ─── CREATE ──────────────────────────────────────────────────────────────────

    @Test
    @DisplayName("create: should save and return new product listing")
    void create_success() {
        when(userRepository.findByEmail("owner@example.com")).thenReturn(Optional.of(owner));
        when(productRepository.save(any(Product.class))).thenReturn(availableProduct);

        ProductResponse result = productService.create(productRequest, "owner@example.com");

        assertThat(result.getName()).isEqualTo("Tripod Stand");
        assertThat(result.getDailyRate()).isEqualByComparingTo(new BigDecimal("50.00"));
        verify(productRepository).save(any(Product.class));
    }

    // ─── UPDATE ──────────────────────────────────────────────────────────────────

    @Test
    @DisplayName("update: should throw UnauthorizedAccessException when non-owner tries to edit")
    void update_unauthorised_throws() {
        when(productRepository.findById(10L)).thenReturn(Optional.of(availableProduct));
        when(userRepository.findByEmail("other@example.com")).thenReturn(Optional.of(otherUser));

        assertThatThrownBy(() -> productService.update(10L, productRequest, "other@example.com"))
                .isInstanceOf(UnauthorizedAccessException.class)
                .hasMessageContaining("only update your own");
    }

    @Test
    @DisplayName("update: should update fields when called by owner")
    void update_success() {
        ProductRequest updateReq = ProductRequest.builder()
                .name("Updated Tripod").price(new BigDecimal("60.00")).build();
        Product updated = Product.builder()
                .id(10L).user(owner).name("Updated Tripod")
                .price(new BigDecimal("60.00")).stock(1).category("Photography")
                .status(Product.ProductStatus.AVAILABLE).build();

        when(productRepository.findById(10L)).thenReturn(Optional.of(availableProduct));
        when(userRepository.findByEmail("owner@example.com")).thenReturn(Optional.of(owner));
        when(productRepository.save(any(Product.class))).thenReturn(updated);

        ProductResponse result = productService.update(10L, updateReq, "owner@example.com");

        assertThat(result.getName()).isEqualTo("Updated Tripod");
    }

    // ─── DELETE ──────────────────────────────────────────────────────────────────

    @Test
    @DisplayName("delete: should mark product as REMOVED when called by owner")
    void delete_success() {
        when(productRepository.findById(10L)).thenReturn(Optional.of(availableProduct));
        when(userRepository.findByEmail("owner@example.com")).thenReturn(Optional.of(owner));
        when(productRepository.save(any(Product.class))).thenReturn(availableProduct);

        assertThatCode(() -> productService.delete(10L, "owner@example.com"))
                .doesNotThrowAnyException();

        verify(productRepository).save(argThat(p -> p.getStatus() == Product.ProductStatus.REMOVED));
    }

    @Test
    @DisplayName("delete: should throw UnauthorizedAccessException when non-owner tries to delete")
    void delete_unauthorised_throws() {
        when(productRepository.findById(10L)).thenReturn(Optional.of(availableProduct));
        when(userRepository.findByEmail("other@example.com")).thenReturn(Optional.of(otherUser));

        assertThatThrownBy(() -> productService.delete(10L, "other@example.com"))
                .isInstanceOf(UnauthorizedAccessException.class);
    }
}
