package com.tutor.eclass.auth;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import com.tutor.eclass.user.User;
import com.tutor.eclass.user.UserRepository;
import com.tutor.eclass.user.UserStatus;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PasswordResetServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private AccountTokenRepository accountTokenRepository;

    @Mock
    private TokenService tokenService;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private User user;

    private PasswordResetService service;

    private final UUID userId = UUID.randomUUID();
    private final String rawToken = "a".repeat(43);
    private final String tokenHash = "b".repeat(64);
    private final String password = "NewPassword123!";

    @BeforeEach
    void setUp() {
        service = new PasswordResetService(
            userRepository,
            accountTokenRepository,
            tokenService,
            passwordEncoder,
            "http://localhost:3000"
        );
    }

    @Test
    void validTokenChangesPasswordAndCannotBeReused() {
        AccountToken token = AccountToken.createPasswordReset(
            userId,
            tokenHash,
            Instant.now().plusSeconds(1800)
        );

        mockTokenLookup(token);
        when(user.getStatus()).thenReturn(UserStatus.ACTIVE);
        when(passwordEncoder.encode(password)).thenReturn("encoded-password");

        ResetPasswordRequest request =
            new ResetPasswordRequest(rawToken, password);

        service.resetPassword(request);

        verify(user).changePassword("encoded-password");
        assertFalse(token.isUsableAt(Instant.now()));

        ResponseStatusException exception = assertThrows(
            ResponseStatusException.class,
            () -> service.resetPassword(request)
        );

        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());

        // Η δεύτερη προσπάθεια δεν πρέπει να αλλάξει ξανά τον κωδικό.
        verify(passwordEncoder).encode(password);
        verify(user).changePassword("encoded-password");
    }

    @Test
    void expiredTokenCannotChangePassword() {
        AccountToken token = AccountToken.createPasswordReset(
            userId,
            tokenHash,
            Instant.now().minusSeconds(60)
        );

        mockTokenLookup(token);

        ResponseStatusException exception = assertThrows(
            ResponseStatusException.class,
            () -> service.resetPassword(
                new ResetPasswordRequest(rawToken, password)
            )
        );

        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
        verifyNoInteractions(passwordEncoder, user);
    }

    @Test
    void invitationTokenCannotResetPassword() {
        AccountToken token = AccountToken.createInvitation(
            userId,
            tokenHash,
            Instant.now().plusSeconds(1800)
        );

        when(tokenService.hashToken(rawToken)).thenReturn(tokenHash);
        when(accountTokenRepository.findByTokenHashForUpdate(tokenHash))
            .thenReturn(Optional.of(token));

        ResponseStatusException exception = assertThrows(
            ResponseStatusException.class,
            () -> service.resetPassword(
                new ResetPasswordRequest(rawToken, password)
            )
        );

        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
        verifyNoInteractions(userRepository, passwordEncoder, user);
    }

    @Test
    void disabledAccountCannotResetPassword() {
        AccountToken token = AccountToken.createPasswordReset(
            userId,
            tokenHash,
            Instant.now().plusSeconds(1800)
        );

        mockTokenLookup(token);
        when(user.getStatus()).thenReturn(UserStatus.DISABLED);

        ResponseStatusException exception = assertThrows(
            ResponseStatusException.class,
            () -> service.resetPassword(
                new ResetPasswordRequest(rawToken, password)
            )
        );

        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
        verifyNoInteractions(passwordEncoder);
        org.mockito.Mockito.verify(user, org.mockito.Mockito.never())
            .changePassword(org.mockito.ArgumentMatchers.anyString());
    }

    @Test
    void passwordOver72BytesIsRejected() {
        String oversizedPassword = "α".repeat(40);

        ResponseStatusException exception = assertThrows(
            ResponseStatusException.class,
            () -> service.resetPassword(
                new ResetPasswordRequest(rawToken, oversizedPassword)
            )
        );

        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());

        verifyNoInteractions(
            tokenService,
            accountTokenRepository,
            userRepository,
            passwordEncoder
        );
    }

    @Test
    void unknownEmailDoesNotCreateToken() {
        when(userRepository.findByEmail("unknown@example.com"))
            .thenReturn(Optional.empty());

        var result = service.preparePasswordReset(
            new ForgotPasswordRequest("unknown@example.com")
        );

        assertEquals(Optional.empty(), result);
        verifyNoInteractions(tokenService, accountTokenRepository);
    }

    private void mockTokenLookup(AccountToken token) {
        when(tokenService.hashToken(rawToken)).thenReturn(tokenHash);
        when(accountTokenRepository.findByTokenHashForUpdate(tokenHash))
            .thenReturn(Optional.of(token));
        when(userRepository.findByIdForUpdate(userId))
            .thenReturn(Optional.of(user));
    }
}