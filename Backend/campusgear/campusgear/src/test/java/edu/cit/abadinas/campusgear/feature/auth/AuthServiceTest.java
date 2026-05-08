package edu.cit.abadinas.campusgear.feature.auth;

import edu.cit.abadinas.campusgear.shared.entity.RefreshToken;
import edu.cit.abadinas.campusgear.shared.entity.User;
import edu.cit.abadinas.campusgear.shared.repository.RefreshTokenRepository;
import edu.cit.abadinas.campusgear.shared.repository.UserRepository;
import edu.cit.abadinas.campusgear.shared.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("AuthService Unit Tests")
class AuthServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private RefreshTokenRepository refreshTokenRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private JwtService jwtService;
    @Mock private AuthenticationManager authenticationManager;
    @Mock private UserDetailsService userDetailsService;

    @InjectMocks
    private AuthService authService;

    private User sampleUser;
    private RegisterRequest registerRequest;
    private LoginRequest loginRequest;

    @BeforeEach
    void setUp() {
        sampleUser = User.builder()
                .id(1L)
                .email("test@example.com")
                .password("encoded_password")
                .firstname("John")
                .lastname("Doe")
                .role(User.Role.ROLE_USER)
                .authProvider("LOCAL")
                .isVerified(false)
                .build();

        registerRequest = new RegisterRequest("test@example.com", "password123", "John", "Doe");
        loginRequest = new LoginRequest("test@example.com", "password123");
    }

    // ─── REGISTER TESTS ─────────────────────────────────────────────────────────

    @Test
    @DisplayName("register: should create account and return tokens when email is unique")
    void register_success() {
        // given
        when(userRepository.existsByEmail("test@example.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("encoded_password");
        when(userRepository.save(any(User.class))).thenReturn(sampleUser);
        UserDetails mockDetails = mock(UserDetails.class);
        when(userDetailsService.loadUserByUsername("test@example.com")).thenReturn(mockDetails);
        when(jwtService.generateAccessToken(mockDetails)).thenReturn("access_token");
        when(jwtService.generateRefreshToken(mockDetails)).thenReturn("refresh_token");
        when(refreshTokenRepository.save(any(RefreshToken.class))).thenReturn(null);

        // when
        AuthResponse response = authService.register(registerRequest);

        // then
        assertThat(response).isNotNull();
        assertThat(response.getAccessToken()).isEqualTo("access_token");
        assertThat(response.getRefreshToken()).isEqualTo("refresh_token");
        assertThat(response.getUser().getEmail()).isEqualTo("test@example.com");
        verify(userRepository).save(any(User.class));
    }

    @Test
    @DisplayName("register: should throw DuplicateEmailException when email already exists")
    void register_duplicateEmail_throws() {
        // given
        when(userRepository.existsByEmail("test@example.com")).thenReturn(true);

        // when / then
        assertThatThrownBy(() -> authService.register(registerRequest))
                .isInstanceOf(DuplicateEmailException.class)
                .hasMessageContaining("already exists");
        verify(userRepository, never()).save(any());
    }

    // ─── LOGIN TESTS ─────────────────────────────────────────────────────────────

    @Test
    @DisplayName("login: should return tokens on valid credentials")
    void login_success() {
        // given
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(null);
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(sampleUser));
        UserDetails mockDetails = mock(UserDetails.class);
        when(userDetailsService.loadUserByUsername("test@example.com")).thenReturn(mockDetails);
        when(jwtService.generateAccessToken(mockDetails)).thenReturn("access_token");
        when(jwtService.generateRefreshToken(mockDetails)).thenReturn("refresh_token");
        when(refreshTokenRepository.save(any(RefreshToken.class))).thenReturn(null);

        // when
        AuthResponse response = authService.login(loginRequest);

        // then
        assertThat(response.getAccessToken()).isEqualTo("access_token");
        assertThat(response.getUser().getEmail()).isEqualTo("test@example.com");
    }

    @Test
    @DisplayName("login: should throw InvalidCredentialsException on bad password")
    void login_badCredentials_throws() {
        // given
        doThrow(new BadCredentialsException("bad credentials"))
                .when(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));

        // when / then
        assertThatThrownBy(() -> authService.login(loginRequest))
                .isInstanceOf(InvalidCredentialsException.class)
                .hasMessageContaining("incorrect");
    }

    // ─── GET CURRENT USER ────────────────────────────────────────────────────────

    @Test
    @DisplayName("getCurrentUser: should return user DTO for valid email")
    void getCurrentUser_success() {
        // given
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(sampleUser));

        // when
        AuthResponse.UserDto dto = authService.getCurrentUser("test@example.com");

        // then
        assertThat(dto.getEmail()).isEqualTo("test@example.com");
        assertThat(dto.getFirstname()).isEqualTo("John");
        assertThat(dto.getRole()).isEqualTo("ROLE_USER");
    }

    // ─── LOGOUT TESTS ────────────────────────────────────────────────────────────

    @Test
    @DisplayName("logout: should delete refresh tokens for user")
    void logout_success() {
        // given
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(sampleUser));

        // when
        authService.logout("test@example.com");

        // then
        verify(refreshTokenRepository).deleteByUserId(1L);
    }
}
