package edu.cit.abadinas.campusgear.api

import edu.cit.abadinas.campusgear.model.ApiResponse
import edu.cit.abadinas.campusgear.model.AuthResponse
import edu.cit.abadinas.campusgear.model.LoginRequest
import edu.cit.abadinas.campusgear.model.RegisterRequest
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.POST

// Retrofit service interface for authentication-related API endpoints.
// Matches the backend AuthController at /api/auth/endpoints.
interface AuthApiService {

    // Register a new user account - POST /api/auth/register
    @POST("auth/register")
    suspend fun register(@Body request: RegisterRequest): Response<ApiResponse<AuthResponse>>

    // Login with email and password - POST /api/auth/login
    @POST("auth/login")
    suspend fun login(@Body request: LoginRequest): Response<ApiResponse<AuthResponse>>
}
