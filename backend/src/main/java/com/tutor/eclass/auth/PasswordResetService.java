package com.tutor.eclass.auth;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Locale;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.tutor.eclass.user.User;
import com.tutor.eclass.user.UserRepository;
import com.tutor.eclass.user.UserStatus;

@Service
public class PasswordResetService {

    private final UserRepository userRepository;
    private final AccountTokenRepository accountTokenRepository;
    private final TokenService tokenService;
    private final PasswordEncoder passwordEncoder;
    private final String frontendUrl;

    public PasswordResetService(
            UserRepository userRepository,
            AccountTokenRepository accountTokenRepository,
            TokenService tokenService,
            PasswordEncoder passwordEncoder,
            @Value("${app.frontend-url:http://localhost:3000}")
            String frontendUrl) {

        this.userRepository = userRepository;
        this.accountTokenRepository = accountTokenRepository;
        this.tokenService = tokenService;
        this.passwordEncoder = passwordEncoder;
        this.frontendUrl = frontendUrl;
    }

    @Transactional
    public Optional<PreparedPasswordReset> preparePasswordReset(
            ForgotPasswordRequest request) {

        String email = request.email()
            .strip()
            .toLowerCase(Locale.ROOT);

        Optional<User> result = userRepository.findByEmail(email);

        if (result.isEmpty()) {
            return Optional.empty();
        }

        User user = result.get();

        if (user.getStatus() != UserStatus.ACTIVE) {
            return Optional.empty();
        }

        String rawToken = tokenService.generateToken();
        String tokenHash = tokenService.hashToken(rawToken);
        Instant expiresAt = Instant.now().plus(30, ChronoUnit.MINUTES);

        AccountToken token = AccountToken.createPasswordReset(
            user.getId(),
            tokenHash,
            expiresAt
        );

        accountTokenRepository.save(token);

        String resetUrl = frontendUrl.replaceAll("/+$", "")
            + "/reset-password?token=" + rawToken;

        return Optional.of(new PreparedPasswordReset(
            user.getEmail(),
            user.getFullName(),
            resetUrl
        ));
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        if (request.password()
                .getBytes(StandardCharsets.UTF_8).length > 72) {

            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Ο κωδικός υπερβαίνει το όριο των 72 bytes"
            );
        }

        String tokenHash = tokenService.hashToken(request.token());

        AccountToken token = accountTokenRepository
            .findByTokenHashForUpdate(tokenHash)
            .orElseThrow(this::invalidReset);

        if (token.getPurpose() != TokenPurpose.PASSWORD_RESET) {
            throw invalidReset();
        }

        User user = userRepository
            .findByIdForUpdate(token.getUserId())
            .orElseThrow(this::invalidReset);

        Instant now = Instant.now();

        if (!token.isUsableAt(now)
                || user.getStatus() != UserStatus.ACTIVE) {

            throw invalidReset();
        }

        String passwordHash = passwordEncoder.encode(request.password());

        user.changePassword(passwordHash);
        token.markUsedAt(now);
    }

    private ResponseStatusException invalidReset() {
        return new ResponseStatusException(
            HttpStatus.BAD_REQUEST,
            "Ο σύνδεσμος επαναφοράς δεν είναι έγκυρος ή έχει λήξει"
        );
    }
}