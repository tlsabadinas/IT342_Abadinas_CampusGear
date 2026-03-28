package edu.cit.abadinas.campusgear.ui

import android.content.Intent
import android.os.Bundle
import android.util.Patterns
import android.view.View
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.google.gson.Gson
import edu.cit.abadinas.campusgear.R
import edu.cit.abadinas.campusgear.api.ApiClient
import edu.cit.abadinas.campusgear.databinding.ActivityLoginBinding
import edu.cit.abadinas.campusgear.model.ApiResponse
import edu.cit.abadinas.campusgear.model.LoginRequest
import edu.cit.abadinas.campusgear.util.SessionManager
import kotlinx.coroutines.launch

class LoginActivity : AppCompatActivity() {

    private lateinit var binding: ActivityLoginBinding
    private lateinit var sessionManager: SessionManager

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityLoginBinding.inflate(layoutInflater)
        setContentView(binding.root)

        sessionManager = SessionManager(this)

        if (sessionManager.isLoggedIn()) {
            navigateToHome()
            return
        }

        setupClickListeners()
    }

    private fun setupClickListeners() {
        binding.btnLogin.setOnClickListener {
            if (validateInputs()) {
                performLogin()
            }
        }

        binding.btnGoToRegister.setOnClickListener {
            startActivity(Intent(this, RegisterActivity::class.java))
            finish()
        }
    }

    private fun validateInputs(): Boolean {
        var isValid = true

        val email = binding.etEmail.text.toString().trim()
        val password = binding.etPassword.text.toString().trim()

        binding.tilEmail.error = null
        binding.tilPassword.error = null
        hideError()

        if (email.isEmpty()) {
            binding.tilEmail.error = "Email is required"
            isValid = false
        } else if (!Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
            binding.tilEmail.error = "Please enter a valid email"
            isValid = false
        }

        if (password.isEmpty()) {
            binding.tilPassword.error = "Password is required"
            isValid = false
        }

        return isValid
    }

    private fun performLogin() {
        val email = binding.etEmail.text.toString().trim()
        val password = binding.etPassword.text.toString().trim()

        showLoading(true)
        hideError()

        lifecycleScope.launch {
            try {
                val request = LoginRequest(email = email, password = password)
                val response = ApiClient.authApiService.login(request)

                if (response.isSuccessful && response.body()?.success == true) {
                    val authData = response.body()?.data
                    if (authData != null) {
                        sessionManager.saveAuthData(
                            accessToken = authData.accessToken ?: "",
                            refreshToken = authData.refreshToken ?: "",
                            userId = authData.user?.id ?: 0L,
                            email = authData.user?.email ?: "",
                            firstname = authData.user?.firstname ?: "",
                            lastname = authData.user?.lastname ?: "",
                            role = authData.user?.role ?: ""
                        )
                        navigateToHome()
                    } else {
                        showError("Something went wrong. Please try again.")
                    }
                } else {
                    val errorBody = response.errorBody()?.string()
                    showError(parseErrorMessage(errorBody))
                }
            } catch (e: Exception) {
                showError("Network error. Please check your connection.")
            } finally {
                showLoading(false)
            }
        }
    }

    private fun parseErrorMessage(errorBody: String?): String {
        return try {
            if (errorBody != null) {
                val errorResponse = Gson().fromJson(errorBody, ApiResponse::class.java)
                errorResponse.error?.message ?: errorResponse.error?.details?.toString()
                ?: "Something went wrong."
            } else {
                "Something went wrong."
            }
        } catch (e: Exception) {
            "Something went wrong."
        }
    }

    private fun showLoading(isLoading: Boolean) {
        binding.progressBar.visibility = if (isLoading) View.VISIBLE else View.GONE
        binding.btnLogin.isEnabled = !isLoading
        binding.btnLogin.text = if (isLoading) "Signing in\u2026" else "Sign In"
    }

    private fun showError(message: String) {
        binding.tvErrorMessage.text = message
        binding.tvErrorMessage.visibility = View.VISIBLE
    }

    private fun hideError() {
        binding.tvErrorMessage.visibility = View.GONE
    }

    private fun navigateToHome() {
        val intent = Intent(this, HomeActivity::class.java)
        intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
        startActivity(intent)
        finish()
    }
}
