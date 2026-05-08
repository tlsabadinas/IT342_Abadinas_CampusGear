package edu.cit.abadinas.campusgear.shared.util

import android.content.Context
import android.content.SharedPreferences

/**
 * SessionManager handles local storage of JWT tokens and user information
 * using SharedPreferences. Shared across all feature slices.
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

    fun getAccessToken(): String? = prefs.getString(KEY_ACCESS_TOKEN, null)
    fun getRefreshToken(): String? = prefs.getString(KEY_REFRESH_TOKEN, null)
    fun getUserEmail(): String? = prefs.getString(KEY_USER_EMAIL, null)
    fun getUserFirstname(): String? = prefs.getString(KEY_USER_FIRSTNAME, null)
    fun getUserLastname(): String? = prefs.getString(KEY_USER_LASTNAME, null)
    fun getUserRole(): String? = prefs.getString(KEY_USER_ROLE, null)
    fun isLoggedIn(): Boolean = prefs.getBoolean(KEY_IS_LOGGED_IN, false)

    fun clearSession() {
        prefs.edit().clear().apply()
    }
}
