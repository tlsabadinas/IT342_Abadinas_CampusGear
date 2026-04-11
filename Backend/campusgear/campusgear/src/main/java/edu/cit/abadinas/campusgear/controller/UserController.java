package edu.cit.abadinas.campusgear.controller;

import edu.cit.abadinas.campusgear.dto.ApiResponse;
import edu.cit.abadinas.campusgear.dto.ProfileUpdateRequest;
import edu.cit.abadinas.campusgear.entity.User;
import edu.cit.abadinas.campusgear.repository.ProductRepository;
import edu.cit.abadinas.campusgear.repository.OrderRepository;
import edu.cit.abadinas.campusgear.repository.UserRepository;
import edu.cit.abadinas.campusgear.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final PasswordEncoder passwordEncoder;
    private final OrderService orderService;

    public UserController(UserRepository userRepository, ProductRepository productRepository,
                          OrderRepository orderRepository, PasswordEncoder passwordEncoder,
                          OrderService orderService) {
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
        this.passwordEncoder = passwordEncoder;
        this.orderService = orderService;
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getProfile(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        long listingsCount = productRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).size();
        long rentalsCount = orderRepository.countByUserId(user.getId());

        BigDecimal totalEarned = orderRepository.findByProductUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(order -> order.getTotal())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, Object> profileData = new HashMap<>();
        profileData.put("id", user.getId());
        profileData.put("email", user.getEmail());
        profileData.put("firstname", user.getFirstname());
        profileData.put("lastname", user.getLastname());
        profileData.put("phone", user.getPhone());
        profileData.put("role", user.getRole().name());
        profileData.put("createdAt", user.getCreatedAt());
        profileData.put("listingsCount", listingsCount);
        profileData.put("rentalsCount", rentalsCount);
        profileData.put("totalEarned", totalEarned);

        return ResponseEntity.ok(ApiResponse.ok(profileData));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<Map<String, String>>> updateProfile(
            @RequestBody ProfileUpdateRequest request,
            Authentication authentication) {

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.getFirstname() != null && !request.getFirstname().isEmpty()) {
            user.setFirstname(request.getFirstname());
        }
        if (request.getLastname() != null && !request.getLastname().isEmpty()) {
            user.setLastname(request.getLastname());
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }

        if (request.getNewPassword() != null && !request.getNewPassword().isEmpty()) {
            if (request.getCurrentPassword() == null || request.getCurrentPassword().isEmpty()) {
                throw new RuntimeException("Current password is required to set a new password");
            }
            if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
                throw new RuntimeException("Current password is incorrect");
            }
            if (request.getNewPassword().length() < 8) {
                throw new RuntimeException("New password must be at least 8 characters");
            }
            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        }

        userRepository.save(user);

        Map<String, String> result = new HashMap<>();
        result.put("message", "Profile updated successfully.");
        return ResponseEntity.ok(ApiResponse.ok(result));
    }
}
