package com.tutor.eclass.user;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private CurrentUserService currentUserService;

    @InjectMocks
    private UserService userService;

    private User user;

    @BeforeEach
    void setUp() {
        user = User.createTeacher(
            "Test Teacher",
            "teacher@example.com",
            "old-hash"
        );

        given(currentUserService.getCurrentUser())
            .willReturn(user);

        given(userRepository.findByIdForUpdate(user.getId()))
            .willReturn(Optional.of(user));
    }

    @Test
    void wrongCurrentPasswordDoesNotChangePassword() {
        given(passwordEncoder.matches("wrong-password", "old-hash"))
            .willReturn(false);

        ChangePasswordRequest request = new ChangePasswordRequest(
            "wrong-password",
            "new-password-123"
        );

        ResponseStatusException exception = assertThrows(
            ResponseStatusException.class,
            () -> userService.changePassword(request)
        );

        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
        assertEquals("old-hash", user.getPasswordHash());

        verify(passwordEncoder, never()).encode(anyString());
    }

    @Test
    void correctCurrentPasswordUpdatesPasswordHash() {
        given(passwordEncoder.matches("old-password-123", "old-hash"))
            .willReturn(true);

        given(passwordEncoder.encode("new-password-123"))
            .willReturn("new-hash");

        ChangePasswordRequest request = new ChangePasswordRequest(
            "old-password-123",
            "new-password-123"
        );

        userService.changePassword(request);

        assertEquals("new-hash", user.getPasswordHash());

        verify(passwordEncoder)
            .matches("old-password-123", "old-hash");

        verify(passwordEncoder).encode("new-password-123");
    }

    @Test
    void passwordOver72BytesIsRejected() {
        String newPassword = "α".repeat(40);

        ChangePasswordRequest request = new ChangePasswordRequest(
            "old-password-123",
            newPassword
        );

        ResponseStatusException exception = assertThrows(
            ResponseStatusException.class,
            () -> userService.changePassword(request)
        );

        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
        assertEquals("old-hash", user.getPasswordHash());

        verify(passwordEncoder, never()).matches(anyString(), anyString());
        verify(passwordEncoder, never()).encode(anyString());
    }
}