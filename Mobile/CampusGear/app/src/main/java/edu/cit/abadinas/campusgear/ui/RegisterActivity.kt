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
import edu.cit.abadinas.campusgear.databinding.ActivityRegisterBinding
import edu.cit.abadinas.campusgear.model.ApiResponse
import edu.cit.abadinas.campusgear.model.RegisterRequest
import edu.cit.abadinas.campusgear.util.SessionManager
import kotlinx.coroutines.launch

class RegisterActivity : AppCompatActivity() {

    private lateinit var binding: ActivityRegisterBinding
    private lateinit var sessionManager: SessionManager

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityRegisterBinding.inflate(layoutInflater)
        setContentView(binding.root)

        sessionManager = SessionManager(this)

        setupClickListeners()
    }

    private fun setupClickListeners() {
        binding.btnRegister.setOnClickListener {
            if (validateInputs()) {
                performRegistration()
            }
        }

        binding.btnGoToLogin.setOnClickListener {
            startActivity(Intent(this, LoginActivity::class.java))
            finish()
        }
    }

    private fun validateInputs(): Boolean {
        var isValid = true

        val firstname = binding.etFirstname.text.toString().trim()
        val lastname = binding.etLastname.text.toString().trim()
        val email = binding.etEmail.text.toString().trim()
        val password = binding.etPassword.text.toString().trim()
        val confirmPassword = binding.etConfirmPassword.text.toString().trim()

        binding.tilFirstname.error = null
        binding.tilLastname.error = null
        binding.tilEmail.error = null
        binding.tilPassword.error = null
        binding.tilConfirmPassword.error = null
        hideError()

        if (firstname.isEmpty()) {
            binding.tilFirstname.error = "First name required"
            isValid = false
        }
        
        if (lastname.isEmpty()) {
            binding.tilLastname.error = "Last name required"
            isValid = false
        }

        if (email.isEmpty()) {
            binding.tilEmail.error = "Email required"
            isValid = false
        } else if (!Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
            binding.tilEmail.error = "Invalid email"
            isValid = false
        }

        if (password.isEmpty()) {
            binding.tilPassword.error = "Password required"
            isValid = false
        } else if (password.length < 8) {
            binding.tilPassword.error = "Min 8 characters"
            isValid = false
        }

        if (confirmPassword.isEmpty()) {
            binding.tilConfirmPassword.error = "Confirm password"
            isValid = false
        } else if (password != confirmPassword) {
            binding.tilConfirmPassword.error = "Passwords do not match"
            isValid = false
        }

        return isValid
    }

    private fun performRegistration() {
        val firstname = binding.etFirstname.text.toString().trim()
        val lastname = binding.etLastname.text.toString().trim()
        val email = binding.etEmail.text.toString().trim()
        val password = binding.etPassword.text.toString().trim()

        showLoading(true)
        hideError()

        lifecycleScope.launch {
            try {
                // Send matching fields to backend
                val request = RegisterRequest(
                    email = email,
                    password = password,
                    firstname = firstname,
                    lastname = lastname
                )
                val response = ApiClient.authApiService.register(request)

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

    @Suppress("UNCHECKED_CAST")
    private fun parseErrorMessage(errorBody: String?): String {
        return try {
            if (errorBody != null) {
                val errorResponse = Gson().fromJson(errorBody, ApiResponse::class.java)
                val error = errorResponse.error
                if (error?.details is Map<*, *>) {
                    val details = error.details as Map<*, *>
                    details.values.joinToString("\n") { it.toString() }
                } else {
                    error?.details?.toString() ?: error?.message ?: "Something went wrong."
                }
            } else {
                "Something went wrong."
            }
        } catch (e: Exception) {
            "Something went wrong."
        }
    }

    private fun showLoading(isLoading: Boolean) {
        binding.progressBar.visibility = if (isLoading) View.VISIBLE else View.GONE
        binding.btnRegister.isEnabled = !isLoading
        binding.btnRegister.text = if (isLoading) "Creating account\u2026" else "Create Account"
    }

    private fun showError(message: String) {
        binding.tvErrorMessage.text = message
        binding.tvErrorMessage.visibility = View.VISIBLE
        binding.tvSuccessMessage.visibility = View.GONE
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
