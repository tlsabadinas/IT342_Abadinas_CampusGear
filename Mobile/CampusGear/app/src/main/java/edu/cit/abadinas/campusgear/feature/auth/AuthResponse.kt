package edu.cit.abadinas.campusgear.feature.auth

import com.google.gson.annotations.SerializedName

/** Authentication response from the backend. */
data class AuthResponse(
    @SerializedName("user") val user: UserDto?,
    @SerializedName("accessToken") val accessToken: String?,
    @SerializedName("refreshToken") val refreshToken: String?
)

/** User DTO nested inside AuthResponse. */
data class UserDto(
    @SerializedName("id") val id: Long?,
    @SerializedName("email") val email: String?,
    @SerializedName("firstname") val firstname: String?,
    @SerializedName("lastname") val lastname: String?,
    @SerializedName("role") val role: String?
)
