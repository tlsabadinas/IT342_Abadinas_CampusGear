package edu.cit.abadinas.campusgear.model

import com.google.gson.annotations.SerializedName

/**
 * Request payload for user registration.
 * Matches the backend's RegisterRequest DTO: email, password, firstname, lastname.
 */
data class RegisterRequest(
    @SerializedName("email")
    val email: String,

    @SerializedName("password")
    val password: String,

    @SerializedName("firstname")
    val firstname: String,

    @SerializedName("lastname")
    val lastname: String
)
