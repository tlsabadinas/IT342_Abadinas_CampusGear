// This is a placeholder ProGuard rules file.
// Retrofit & Gson rules for release builds
-keepattributes Signature
-keepattributes *Annotation*
-keep class edu.cit.abadinas.campusgear.model.** { *; }
-keep class com.google.gson.** { *; }
-keepclassmembers class * {
    @com.google.gson.annotations.SerializedName <fields>;
}
-dontwarn okhttp3.**
-dontwarn retrofit2.**
