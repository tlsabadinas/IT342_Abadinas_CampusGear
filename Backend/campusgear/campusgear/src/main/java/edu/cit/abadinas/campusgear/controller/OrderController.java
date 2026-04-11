package edu.cit.abadinas.campusgear.controller;

import edu.cit.abadinas.campusgear.dto.ApiResponse;
import edu.cit.abadinas.campusgear.dto.OrderRequest;
import edu.cit.abadinas.campusgear.dto.OrderResponse;
import edu.cit.abadinas.campusgear.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<OrderResponse>> createOrder(
            @Valid @RequestBody OrderRequest request,
            Authentication authentication) {
        OrderResponse order = orderService.createOrder(request, authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(order));
    }

    @GetMapping("/my-rentals")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getMyRentals(Authentication authentication) {
        List<OrderResponse> orders = orderService.getMyRentals(authentication.getName());
        return ResponseEntity.ok(ApiResponse.ok(orders));
    }

    @GetMapping("/my-lendings")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getMyLendings(Authentication authentication) {
        List<OrderResponse> orders = orderService.getMyLendings(authentication.getName());
        return ResponseEntity.ok(ApiResponse.ok(orders));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderResponse>> getById(
            @PathVariable Long id,
            Authentication authentication) {
        OrderResponse order = orderService.getById(id, authentication.getName());
        return ResponseEntity.ok(ApiResponse.ok(order));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<OrderResponse>> cancelOrder(
            @PathVariable Long id,
            Authentication authentication) {
        OrderResponse order = orderService.cancelOrder(id, authentication.getName());
        return ResponseEntity.ok(ApiResponse.ok(order));
    }
}
