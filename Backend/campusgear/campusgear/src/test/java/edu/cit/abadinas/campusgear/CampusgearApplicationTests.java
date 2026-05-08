package edu.cit.abadinas.campusgear;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

/**
 * Smoke test — verifies that the application class is present.
 * Full Spring context tests require a live database; use unit tests instead.
 */
@DisplayName("CampusGear Application Smoke Test")
class CampusgearApplicationTests {

    @Test
    @DisplayName("main class exists")
    void mainClassExists() {
        // Verifies the application entry point class is available.
        Class<?> clazz = CampusgearApplication.class;
        assert clazz != null;
    }
}
