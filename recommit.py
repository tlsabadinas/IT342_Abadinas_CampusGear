import os
import subprocess

def run(cmd):
    print(f"Running: {cmd}")
    subprocess.run(cmd, shell=True, check=True)

try:
    # Reset soft
    run("git reset --soft HEAD~1")
    run("git reset")

    # Backend Core & Products
    run("git add Backend/campusgear/campusgear/src/main/resources/application.properties")
    run("git add Backend/campusgear/campusgear/src/main/java/edu/cit/abadinas/campusgear/entity/Product.java")
    run("git add Backend/campusgear/campusgear/src/main/java/edu/cit/abadinas/campusgear/repository/ProductRepository.java")
    run("git add Backend/campusgear/campusgear/src/main/java/edu/cit/abadinas/campusgear/service/ProductService.java")
    run("git add Backend/campusgear/campusgear/src/main/java/edu/cit/abadinas/campusgear/controller/ProductController.java")
    run("git add Backend/campusgear/campusgear/src/main/java/edu/cit/abadinas/campusgear/dto/ProductRequest.java")
    run("git add Backend/campusgear/campusgear/src/main/java/edu/cit/abadinas/campusgear/dto/ProductResponse.java")
    run("git commit -m \"feat(backend): implement product catalog and listing endpoints\" -q")

    # Backend Orders
    run("git add Backend/campusgear/campusgear/src/main/java/edu/cit/abadinas/campusgear/entity/Order.java")
    run("git add Backend/campusgear/campusgear/src/main/java/edu/cit/abadinas/campusgear/entity/OrderItem.java")
    run("git add Backend/campusgear/campusgear/src/main/java/edu/cit/abadinas/campusgear/repository/OrderRepository.java")
    run("git add Backend/campusgear/campusgear/src/main/java/edu/cit/abadinas/campusgear/repository/OrderItemRepository.java")
    run("git add Backend/campusgear/campusgear/src/main/java/edu/cit/abadinas/campusgear/service/OrderService.java")
    run("git add Backend/campusgear/campusgear/src/main/java/edu/cit/abadinas/campusgear/controller/OrderController.java")
    run("git add Backend/campusgear/campusgear/src/main/java/edu/cit/abadinas/campusgear/dto/OrderRequest.java")
    run("git add Backend/campusgear/campusgear/src/main/java/edu/cit/abadinas/campusgear/dto/OrderResponse.java")
    run("git commit -m \"feat(backend): add order processing, validation, and transaction management\" -q")

    # Backend Users
    run("git add Backend/campusgear/campusgear/src/main/java/edu/cit/abadinas/campusgear/entity/User.java")
    run("git add Backend/campusgear/campusgear/src/main/java/edu/cit/abadinas/campusgear/entity/RefreshToken.java")
    run("git add Backend/campusgear/campusgear/src/main/java/edu/cit/abadinas/campusgear/repository/UserRepository.java")
    run("git add Backend/campusgear/campusgear/src/main/java/edu/cit/abadinas/campusgear/repository/RefreshTokenRepository.java")
    run("git add Backend/campusgear/campusgear/src/main/java/edu/cit/abadinas/campusgear/service/AuthService.java")
    run("git add Backend/campusgear/campusgear/src/main/java/edu/cit/abadinas/campusgear/controller/UserController.java")
    run("git add Backend/campusgear/campusgear/src/main/java/edu/cit/abadinas/campusgear/config/SecurityConfig.java")
    run("git add Backend/campusgear/campusgear/src/main/java/edu/cit/abadinas/campusgear/exception/GlobalExceptionHandler.java")
    run("git add Backend/campusgear/campusgear/src/main/java/edu/cit/abadinas/campusgear/dto/ProfileUpdateRequest.java")
    
    # Also add the deleted cart files to user changes (or whatever chunk makes sense so they are recorded as deleted in this snapshot)
    run("git add Backend/campusgear/campusgear/src/main/java/edu/cit/abadinas/campusgear/entity/Cart.java")
    run("git add Backend/campusgear/campusgear/src/main/java/edu/cit/abadinas/campusgear/entity/CartItem.java")
    run("git add Backend/campusgear/campusgear/src/main/java/edu/cit/abadinas/campusgear/repository/CartRepository.java")
    run("git add Backend/campusgear/campusgear/src/main/java/edu/cit/abadinas/campusgear/repository/CartItemRepository.java")
    run("git add Backend/campusgear/campusgear/src/main/java/edu/cit/abadinas/campusgear/service/CartService.java")
    run("git add Backend/campusgear/campusgear/src/main/java/edu/cit/abadinas/campusgear/controller/CartController.java")
    run("git commit -m \"feat(backend): implement user profile endpoints and remove unused dependencies\" -q")

    # Frontend Core & API
    run("git add Web/CampusGear/src/services/api.js")
    run("git add Web/CampusGear/src/components/")
    run("git add Web/CampusGear/src/App.jsx")
    run("git add Web/CampusGear/src/pages/Login.jsx")
    run("git add Web/CampusGear/src/pages/Register.jsx")
    run("git commit -m \"feat(frontend): integrate api service and app structure with authentication\" -q")

    # Frontend Dashboard
    run("git add Web/CampusGear/src/pages/Dashboard.jsx")
    run("git add Web/CampusGear/src/pages/ProductDetail.jsx")
    run("git add Web/CampusGear/src/pages/AddListing.jsx")
    run("git add Web/CampusGear/src/pages/MyListings.jsx")
    run("git commit -m \"feat(dashboard): build product listing and equipment views\" -q")

    # Frontend Checkout
    run("git add Web/CampusGear/src/pages/Checkout.jsx")
    run("git add Web/CampusGear/src/pages/BookingConfirmation.jsx")
    run("git commit -m \"feat(checkout): implement secure rental booking flow\" -q")

    # Frontend Profile
    run("git add Web/CampusGear/src/pages/Profile.jsx")
    run("git add Web/CampusGear/src/pages/TransactionHistory.jsx")
    run("git commit -m \"feat(profile): build user account profile and order tracking\" -q")

    # Final Catch-All + Target Commit Message
    run("git add .")
    run("git commit -m \"IT342 Phase 3 – Web Main Feature Completed\" -q")

    print("Success! All commits handled.")
except Exception as e:
    print(f"Failed: {e}")
