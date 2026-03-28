package edu.cit.abadinas.campusgear.util

import android.content.Context
import android.content.SharedPreferences

/**
 * SessionManager handles local storage of JWT tokens and user information
 * using SharedPreferences. Provides methods to save, retrieve, and clear
 * authentication session data.
 */
class SessionManager(context: Context) {

    companion object {
        private const val PREF_NAME = "CampusGearSession"
        private const val KEY_ACCESS_TOKEN = "access_token"
        private const val KEY_REFRESH_TOKEN = "refresh_token"
        private const val KEY_USER_ID = "user_id"
        private const val KEY_USER_EMAIL = "user_email"
        private const val KEY_USER_FIRSTNAME = "user_firstname"
        private const val KEY_USER_LASTNAME = "user_lastname"
        private const val KEY_USER_ROLE = "user_role"
        private const val KEY_IS_LOGGED_IN = "is_logged_in"
    }

    private val prefs: SharedPreferences =
        context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)

    /**
     * Save all authentication data after successful login or registration.
     */
    fun saveAuthData(
        accessToken: String,
        refreshToken: String,
        userId: Long,
        email: String,
        firstname: String,
        lastname: String,
        role: String
    ) {
        prefs.edit().apply {
            putString(KEY_ACCESS_TOKEN, accessToken)
            putString(KEY_REFRESH_TOKEN, refreshToken)
            putLong(KEY_USER_ID, userId)
            putString(KEY_USER_EMAIL, email)
            putString(KEY_USER_FIRSTNAME, firstname)
            putString(KEY_USER_LASTNAME, lastname)
            putString(KEY_USER_ROLE, role)
            putBoolean(KEY_IS_LOGGED_IN, true)
            apply()
        }
    }

    /**
     * Get the stored JWT access token.
     */
    fun getAccessToken(): String? = prefs.getString(KEY_ACCESS_TOKEN, null)

    /**
     * Get the stored JWT refresh token.
     */
    fun getRefreshToken(): String? = prefs.getString(KEY_REFRESH_TOKEN, null)

    /**
     * Get the stored user email.
     */
    fun getUserEmail(): String? = prefs.getString(KEY_USER_EMAIL, null)

    /**
     * Get the stored user first name.
     */
    fun getUserFirstname(): String? = prefs.getString(KEY_USER_FIRSTNAME, null)

    /**
     * Get the stored user last name.
     */
    fun getUserLastname(): String? = prefs.getString(KEY_USER_LASTNAME, null)

    /**
     * Get the stored user role.
     */
    fun getUserRole(): String? = prefs.getString(KEY_USER_ROLE, null)

    /**
     * Check if user is currently logged in.
     */
    fun isLoggedIn(): Boolean = prefs.getBoolean(KEY_IS_LOGGED_IN, false)

    /**
     * Clear all session data (used on logout).
     */
    fun clearSession() {
        prefs.edit().clear().apply()
    }
}
