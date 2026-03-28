package edu.cit.abadinas.campusgear.model

import com.google.gson.annotations.SerializedName

/**
 * Request payload for user login.
 * Matches the backend's LoginRequest DTO: email, password.
 */
data class LoginRequest(
    @SerializedName("email")
    val email: String,

    @SerializedName("password")
    val password: String
)
