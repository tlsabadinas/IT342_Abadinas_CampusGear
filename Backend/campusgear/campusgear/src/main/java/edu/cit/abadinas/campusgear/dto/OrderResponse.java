package edu.cit.abadinas.campusgear.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderResponse {

    private Long id;
    private String orderNumber;
    private BigDecimal total;
    private String status;
    private String shippingAddress;
    private String paymentMethod;
    private LocalDate startDate;
    private LocalDate endDate;
    private LocalDateTime createdAt;
    private List<OrderItemResponse> items;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class OrderItemResponse {
        private Long id;
        private Long productId;
        private String productName;
        private String productImageUrl;
        private String productCategory;
        private Integer quantity;
        private BigDecimal price;
        private LocalDate startDate;
        private LocalDate endDate;
        private Integer totalDays;
        private String listerName;
    }
}
