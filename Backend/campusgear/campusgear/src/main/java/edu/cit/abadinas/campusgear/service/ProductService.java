package edu.cit.abadinas.campusgear.service;

import edu.cit.abadinas.campusgear.dto.ProductRequest;
import edu.cit.abadinas.campusgear.dto.ProductResponse;
import edu.cit.abadinas.campusgear.entity.Product;
import edu.cit.abadinas.campusgear.entity.User;
import edu.cit.abadinas.campusgear.repository.ProductRepository;
import edu.cit.abadinas.campusgear.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public ProductService(ProductRepository productRepository, UserRepository userRepository) {
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    public List<ProductResponse> getAllAvailable() {
        return productRepository.findByStatusOrderByCreatedAtDesc(Product.ProductStatus.AVAILABLE)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public ProductResponse getById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        return toResponse(product);
    }

    public List<ProductResponse> search(String query) {
        return productRepository.findByNameContainingIgnoreCaseAndStatus(query, Product.ProductStatus.AVAILABLE)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<ProductResponse> getByCategory(String category) {
        return productRepository.findByCategoryAndStatus(category, Product.ProductStatus.AVAILABLE)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<ProductResponse> getMyListings(String email) {
        User user = findUserByEmail(email);
        return productRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ProductResponse create(ProductRequest request, String email) {
        User user = findUserByEmail(email);

        Product product = Product.builder()
                .user(user)
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .stock(request.getStock() != null ? request.getStock() : 1)
                .imageUrl(request.getImageUrl())
                .category(request.getCategory())
                .status(Product.ProductStatus.AVAILABLE)
                .build();

        product = productRepository.save(product);
        return toResponse(product);
    }

    @Transactional
    public ProductResponse update(Long id, ProductRequest request, String email) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        User user = findUserByEmail(email);
        if (!product.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedAccessException("You can only update your own listings");
        }

        if (request.getName() != null) product.setName(request.getName());
        if (request.getDescription() != null) product.setDescription(request.getDescription());
        if (request.getPrice() != null) product.setPrice(request.getPrice());
        if (request.getStock() != null) product.setStock(request.getStock());
        if (request.getImageUrl() != null) product.setImageUrl(request.getImageUrl());
        if (request.getCategory() != null) product.setCategory(request.getCategory());

        product = productRepository.save(product);
        return toResponse(product);
    }

    @Transactional
    public void delete(Long id, String email) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        User user = findUserByEmail(email);
        if (!product.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedAccessException("You can only delete your own listings");
        }

        product.setStatus(Product.ProductStatus.REMOVED);
        productRepository.save(product);
    }

    private User findUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private ProductResponse toResponse(Product product) {
        User user = product.getUser();
        String listerName = user.getFirstname() + " " + user.getLastname().charAt(0) + ".";

        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .dailyRate(product.getPrice())
                .stock(product.getStock())
                .imageUrl(product.getImageUrl())
                .category(product.getCategory())
                .status(product.getStatus().name())
                .listerName(listerName)
                .listerId(user.getId())
                .createdAt(product.getCreatedAt())
                .build();
    }

    public static class ResourceNotFoundException extends RuntimeException {
        public ResourceNotFoundException(String message) {
            super(message);
        }
    }

    public static class UnauthorizedAccessException extends RuntimeException {
        public UnauthorizedAccessException(String message) {
            super(message);
        }
    }
}
