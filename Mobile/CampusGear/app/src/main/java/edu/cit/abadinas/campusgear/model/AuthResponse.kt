package edu.cit.abadinas.campusgear.model

import com.google.gson.annotations.SerializedName

/**
 * Authentication response from the backend containing user info and JWT tokens.
 */
data class AuthResponse(
    @SerializedName("user")
    val user: UserDto?,

    @SerializedName("accessToken")
    val accessToken: String?,

    @SerializedName("refreshToken")
    val refreshToken: String?
)

/**
 * User data transfer object returned inside AuthResponse.
 */
data class UserDto(
    @SerializedName("id")
    val id: Long?,

    @SerializedName("email")
    val email: String?,

    @SerializedName("firstname")
    val firstname: String?,

    @SerializedName("lastname")
    val lastname: String?,

    @SerializedName("role")
    val role: String?
)
