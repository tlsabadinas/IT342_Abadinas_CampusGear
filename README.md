# CampusGear — Campus Equipment Rental Platform

## Project Description

CampusGear is a **peer-to-peer campus rental platform** that enables students to list personal items for rent and borrow equipment from others. The system includes a **Spring Boot backend**, a **React web application**, and an **Android mobile app**, all integrated to provide a secure and affordable equipment-sharing ecosystem.

This phase implements **user registration and authentication** using **Spring Boot** for the backend and **React** for the web frontend. Users can register, log in, and access a protected marketplace dashboard. Authentication is secured with **JWT tokens** and passwords are encrypted using **BCrypt**.

---

## Technologies Used

* **Backend**: Spring Boot 3.x, Spring Security, Java 17, MySQL, JWT (JJWT 0.12.6), BCrypt
* **Web Frontend**: React 19, JavaScript (JSX), Tailwind CSS v4, Vite, Axios
* **Mobile App**: Kotlin, Jetpack Compose *(planned)*
* **Database**: MySQL 8.x
* **Build Tools**: Maven (Backend), npm (Web), Gradle (Android)

---

## Steps to Run Backend

1. Clone the repository:
   ```
   git clone <repo-url>
   cd IT342-Abadinas-CampusGear/Backend/campusgear/campusgear
   ```

2. Configure MySQL database in `src/main/resources/application.properties`:
   ```
   spring.datasource.url=jdbc:mysql://localhost:3306/campusgear_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
   spring.datasource.username=root
   spring.datasource.password=
   jwt.secret=YourSuperSecretKeyForJWTTokenGenerationMustBeAtLeast256BitsLongForHS256Algorithm2026
   jwt.access-token-expiration=86400000
   jwt.refresh-token-expiration=604800000
   ```

3. Build and run the backend:
   ```
   ./mvnw clean install
   ./mvnw spring-boot:run
   ```

4. Backend will be running at: [http://localhost:8080](http://localhost:8080)

---

## Steps to Run Web App

1. Navigate to the web frontend folder:
   ```
   cd IT342-Abadinas-CampusGear/Web/CampusGear
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run the development server:
   ```
   npm run dev
   ```

4. Open your browser at: [http://localhost:5173](http://localhost:5173)

---

## Steps to Run Mobile App

1. Navigate to the mobile app folder:
   ```
   cd IT342-Abadinas-CampusGear/Mobile
   ```

2. Open in Android Studio

3. Build and run on emulator or device (API Level 24+)

---

## List of API Endpoints

### Authentication

| Method | Endpoint             | Description                       | Protected |
| ------ | -------------------- | --------------------------------- | --------- |
| POST   | `/api/auth/register` | Register a new user               | No        |
| POST   | `/api/auth/login`    | Log in with email and password    | No        |
| GET    | `/api/auth/me`       | Get current authenticated user    | Yes       |
| POST   | `/api/auth/logout`   | Log out and invalidate tokens     | Yes       |

### User Profile

| Method | Endpoint              | Description                | Protected |
| ------ | --------------------- | -------------------------- | --------- |
| PUT    | `/api/users/profile`  | Update user profile        | Yes       |

### Equipment (Marketplace)

| Method | Endpoint                       | Description                  | Protected |
| ------ | ------------------------------ | ---------------------------- | --------- |
| GET    | `/api/items`                   | List all available equipment | No        |
| GET    | `/api/items/{id}`              | Get equipment details        | No        |
| GET    | `/api/items/search?query=...`  | Search equipment by name     | No        |
| POST   | `/api/items`                   | Create new equipment listing | Yes       |
| PUT    | `/api/items/{id}`              | Update equipment listing     | Yes       |
| DELETE | `/api/items/{id}`              | Delete equipment listing     | Yes       |

### Bookings & Payments

| Method | Endpoint                     | Description                      | Protected |
| ------ | ---------------------------- | -------------------------------- | --------- |
| POST   | `/api/bookings`              | Create a rental booking          | Yes       |
| PUT    | `/api/bookings/{id}/cancel`  | Cancel a booking                 | Yes       |
| POST   | `/api/payments/verify`       | Verify sandbox payment           | Yes       |

### Admin

| Method | Endpoint                  | Description                 | Protected       |
| ------ | ------------------------- | --------------------------- | --------------- |
| GET    | `/api/admin/bookings`     | View all bookings           | Yes (ADMIN)     |
| DELETE | `/api/admin/items/{id}`   | Delete any listing          | Yes (ADMIN)     |

---

"# IT342-Abadinas-CampusGear"
