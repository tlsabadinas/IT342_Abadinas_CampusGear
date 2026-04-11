package edu.cit.abadinas.campusgear.repository;

import edu.cit.abadinas.campusgear.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<Product> findByStatusOrderByCreatedAtDesc(Product.ProductStatus status);

    List<Product> findByNameContainingIgnoreCaseAndStatus(String name, Product.ProductStatus status);

    List<Product> findByCategoryAndStatus(String category, Product.ProductStatus status);

    List<Product> findByStatusAndCategoryOrderByCreatedAtDesc(Product.ProductStatus status, String category);

    List<Product> findAllByOrderByCreatedAtDesc();
}
