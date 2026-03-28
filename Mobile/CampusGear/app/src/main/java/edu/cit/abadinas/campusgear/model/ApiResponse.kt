package edu.cit.abadinas.campusgear.model

import com.google.gson.annotations.SerializedName

/**
 * Generic API response wrapper matching the backend's ApiResponse<T> structure.
 * All backend responses are wrapped in this format.
 */
data class ApiResponse<T>(
    @SerializedName("success")
    val success: Boolean,

    @SerializedName("data")
    val data: T?,

    @SerializedName("error")
    val error: ErrorDetails?,

    @SerializedName("timestamp")
    val timestamp: String?
)

/**
 * Error details returned by the backend when a request fails.
 */
data class ErrorDetails(
    @SerializedName("code")
    val code: String?,

    @SerializedName("message")
    val message: String?,

    @SerializedName("details")
    val details: Any?
)
