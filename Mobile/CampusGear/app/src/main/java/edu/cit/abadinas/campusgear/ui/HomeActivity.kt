package edu.cit.abadinas.campusgear.ui

import android.content.Intent
import android.os.Bundle
import android.widget.ArrayAdapter
import androidx.appcompat.app.AppCompatActivity
import com.google.android.material.dialog.MaterialAlertDialogBuilder
import edu.cit.abadinas.campusgear.R
import edu.cit.abadinas.campusgear.databinding.ActivityHomeBinding
import edu.cit.abadinas.campusgear.util.SessionManager

class HomeActivity : AppCompatActivity() {

    private lateinit var binding: ActivityHomeBinding
    private lateinit var sessionManager: SessionManager

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityHomeBinding.inflate(layoutInflater)
        setContentView(binding.root)

        sessionManager = SessionManager(this)

        if (!sessionManager.isLoggedIn()) {
            navigateToLogin()
            return
        }

        setupUI()
        setupClickListeners()
    }

    private fun setupUI() {
        val firstname = sessionManager.getUserFirstname() ?: ""
        val lastname = sessionManager.getUserLastname() ?: ""

        // User avatar initials
        val initials = (firstname.firstOrNull()?.toString() ?: "") +
                (lastname.firstOrNull()?.toString() ?: "")
        binding.tvUserInitials.text = if (initials.isNotEmpty()) initials.uppercase() else "U"

        // Category spinner
        val categories = arrayOf("All Categories", "Electronics", "Lab Equipment", "Photography", "Sports", "Musical", "Books")
        val adapter = ArrayAdapter(this, android.R.layout.simple_spinner_dropdown_item, categories)
        binding.spinnerCategory.adapter = adapter
    }

    private fun setupClickListeners() {
        binding.btnLogout.setOnClickListener {
            MaterialAlertDialogBuilder(this)
                .setTitle("Sign Out")
                .setMessage("Are you sure you want to sign out?")
                .setNegativeButton("Cancel") { dialog, _ -> dialog.dismiss() }
                .setPositiveButton("Confirm") { _, _ ->
                    sessionManager.clearSession()
                    navigateToLogin()
                }
                .show()
        }
    }

    private fun navigateToLogin() {
        val intent = Intent(this, LoginActivity::class.java)
        intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
        startActivity(intent)
        finish()
    }
}
