# CampusGear — Development Task Checklist

## Phase 1: Planning & Design ✅
- [x] System Design Document (SDD) — requirements, architecture, API contracts
- [x] Database schema design (ERD with 7 tables)
- [x] API endpoint specification (Authentication, Equipment, Bookings, Admin)
- [x] UI/UX wireframes (Web & Mobile)
- [x] Project timeline and milestone planning

## Phase 2: Backend Development (Spring Boot)
### Foundation ✅
- [x] Spring Boot project setup with Maven
- [x] MySQL database configuration (`campusgear_db`)
- [x] JPA entities: `User`, `RefreshToken`
- [x] Repositories: `UserRepository`, `RefreshTokenRepository`
- [x] DTOs: `RegisterRequest`, `LoginRequest`, `AuthResponse`, `ApiResponse`

### Authentication & Security ✅
- [x] JWT service (token generation, validation, claims extraction)
- [x] Spring Security configuration (stateless, BCrypt, filter chain)
- [x] JWT authentication filter
- [x] Custom UserDetailsService
- [x] CORS configuration for React frontend
- [x] `POST /api/auth/register` — user registration with validation
- [x] `POST /api/auth/login` — login with credential validation
- [x] `GET /api/auth/me` — get current authenticated user
- [x] `POST /api/auth/logout` — logout and invalidate refresh tokens
- [x] Global exception handler (SDD error codes: AUTH-001, VALID-001, DB-002, etc.)

### Core Business Features
- [ ] Google OAuth integration
- [x] Equipment entity and CRUD operations (`/api/items`)
- [ ] Image upload via Cloudinary/ImgBB API
- [x] Equipment search and category filtering
- [x] Rental booking functionality (`/api/orders`)
- [x] Sandbox payment gateway integration (Sandbox mode)
- [ ] SMTP email notifications (receipts, verification)
- [x] User profile management (`GET/PUT /api/users/profile`)

### Admin Features (Pending)
- [ ] Admin view all bookings (`GET /api/admin/bookings`)
- [ ] Admin delete listings (`DELETE /api/admin/items/{id}`)
- [ ] Role-based access control enforcement

## Phase 3: Web Application (React + Tailwind CSS)
### Foundation ✅
- [x] Vite + React project setup (JSX, no TypeScript)
- [x] Tailwind CSS v4 integration
- [x] Axios API service with JWT interceptor
- [x] Auth context (global state management)
- [x] Protected route component
- [x] React Router configuration
- [x] CIT-U color scheme (Maroon + Gold + White)

### Pages — Implemented ✅
- [x] Register page (split layout, Google signup button, form validation)
- [x] Login page (split layout, Google login button, error handling)
- [x] Marketplace dashboard (nav bar, search, category pills, equipment card grid)

### Pages — Implemented ✅
- [x] Equipment detail page
- [x] Checkout / booking flow page
- [x] User profile page
- [x] My Listings page (user's own equipment)
- [x] Add equipment listing form
- [x] Transaction history page
- [x] Booking confirmation page
- [ ] Admin dashboard (listing moderation, user management)
- [ ] Responsive design polish for all screen sizes

## Phase 4: Mobile Application (Android)
- [ ] Android Studio project setup (Kotlin, Jetpack Compose)
- [ ] Authentication screens (Register, Login)
- [ ] Equipment browsing (Marketplace)
- [ ] Equipment detail view
- [ ] Booking management
- [ ] Checkout with payment gateway
- [ ] API service layer (Retrofit)
- [ ] UI polish and animations
- [ ] Testing on emulator/device
- [ ] APK generation

## Phase 5: Integration & Deployment
- [ ] End-to-end testing across platforms
- [ ] Bug fixes and optimization
- [ ] Security review
- [ ] Performance testing
- [ ] Backend deployment (Railway/Heroku)
- [ ] Web app deployment (Vercel/Netlify)
- [ ] Mobile APK distribution
- [ ] Final documentation and submission
