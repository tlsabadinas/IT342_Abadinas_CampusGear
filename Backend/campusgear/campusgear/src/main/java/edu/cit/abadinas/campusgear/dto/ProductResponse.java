package edu.cit.abadinas.campusgear.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductResponse {

    private Long id;
    private String name;
    private String description;
    private BigDecimal dailyRate;
    private Integer stock;
    private String imageUrl;
    private String category;
    private String status;
    private String listerName;
    private Long listerId;
    private LocalDateTime createdAt;
}
