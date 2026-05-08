package edu.cit.abadinas.campusgear.feature.auth

import com.google.gson.annotations.SerializedName

/** Request payload for user registration. */
data class RegisterRequest(
    @SerializedName("email") val email: String,
    @SerializedName("password") val password: String,
    @SerializedName("firstname") val firstname: String,
    @SerializedName("lastname") val lastname: String
)
