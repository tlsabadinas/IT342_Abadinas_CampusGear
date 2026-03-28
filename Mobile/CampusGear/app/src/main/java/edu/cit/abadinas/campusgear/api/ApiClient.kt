package edu.cit.abadinas.campusgear.api

import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit

/**
 * Singleton Retrofit client for communicating with the CampusGear backend API.
 *
 * Default base URL uses 10.0.2.2 which is the Android emulator alias
 * for the host machine's localhost. Change this to your machine's IP
 * address if testing on a physical device.
 */
object ApiClient {

    // For Android Emulator → host machine localhost
    private const val BASE_URL = "http://10.0.2.2:8080/api/"

    private val loggingInterceptor = HttpLoggingInterceptor().apply {
        level = HttpLoggingInterceptor.Level.BODY
    }

    private val okHttpClient = OkHttpClient.Builder()
        .addInterceptor(loggingInterceptor)
        .connectTimeout(30, TimeUnit.SECONDS)
        .readTimeout(30, TimeUnit.SECONDS)
        .writeTimeout(30, TimeUnit.SECONDS)
        .build()

    private val retrofit: Retrofit = Retrofit.Builder()
        .baseUrl(BASE_URL)
        .client(okHttpClient)
        .addConverterFactory(GsonConverterFactory.create())
        .build()

    /**
     * Provides the AuthApiService instance for authentication API calls.
     */
    val authApiService: AuthApiService = retrofit.create(AuthApiService::class.java)
}
