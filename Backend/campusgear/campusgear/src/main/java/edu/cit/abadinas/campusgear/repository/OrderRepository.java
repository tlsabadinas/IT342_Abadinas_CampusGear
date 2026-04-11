package edu.cit.abadinas.campusgear.repository;

import edu.cit.abadinas.campusgear.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);

    @Query("SELECT DISTINCT o FROM Order o JOIN o.orderItems oi WHERE oi.product.user.id = :userId ORDER BY o.createdAt DESC")
    List<Order> findByProductUserIdOrderByCreatedAtDesc(@Param("userId") Long userId);

    Optional<Order> findByOrderNumber(String orderNumber);

    long countByUserId(Long userId);

    @Query("SELECT COUNT(DISTINCT o) FROM Order o JOIN o.orderItems oi WHERE oi.product.user.id = :userId")
    long countByProductUserId(@Param("userId") Long userId);
}
