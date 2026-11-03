package com.tutor.eclass.auth;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.tutor.eclass.user.Role;
import com.tutor.eclass.user.User;
import com.tutor.eclass.user.UserRepository;
import com.tutor.eclass.user.UserStatus;

@Service
public class InvitationService {

    private final UserRepository userRepository;
    private final AccountTokenRepository accountTokenRepository;
    private final TokenService tokenService;
    private final String frontendUrl;

    public InvitationService(
            UserRepository userRepository,
            AccountTokenRepository accountTokenRepository,
            TokenService tokenService,
            @Value("${app.frontend-url:http://localhost:3000}")
            String frontendUrl) {

        this.userRepository = userRepository;
        this.accountTokenRepository = accountTokenRepository;
        this.tokenService = tokenService;
        this.frontendUrl = frontendUrl;
    }

    @Transactional
    @PreAuthorize("hasRole('TEACHER')")
    public PreparedInvitation createInvitation(UUID studentId) {
        User student = userRepository.findByIdForUpdate(studentId)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Ο μαθητής δεν βρέθηκε"
            ));

        if (student.getRole() != Role.STUDENT
                || student.getStatus() != UserStatus.INVITED) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "Η πρόσκληση απαιτεί μαθητή σε αναμονή ενεργοποίησης"
            );
        }

        String rawToken = tokenService.generateToken();
        String tokenHash = tokenService.hashToken(rawToken);
        Instant expiresAt = Instant.now().plus(24, ChronoUnit.HOURS);

        AccountToken invitation = AccountToken.createInvitation(
            student.getId(),
            tokenHash,
            expiresAt
        );

        accountTokenRepository.save(invitation);

        String activationUrl = frontendUrl.replaceAll("/+$", "")
            + "/activate?token=" + rawToken;

        return new PreparedInvitation(
            student.getEmail(),
            student.getFullName(),
            activationUrl
        );
    }
}