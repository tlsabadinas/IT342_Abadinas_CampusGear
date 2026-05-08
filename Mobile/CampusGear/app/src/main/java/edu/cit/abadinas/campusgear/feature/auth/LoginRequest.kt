package edu.cit.abadinas.campusgear.feature.auth

import com.google.gson.annotations.SerializedName

/** Request payload for user login. */
data class LoginRequest(
    @SerializedName("email") val email: String,
    @SerializedName("password") val password: String
)
