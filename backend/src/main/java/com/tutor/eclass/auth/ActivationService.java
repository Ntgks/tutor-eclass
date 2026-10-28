package com.tutor.eclass.auth;

import com.tutor.eclass.user.Role;
import com.tutor.eclass.user.User;
import com.tutor.eclass.user.UserRepository;
import com.tutor.eclass.user.UserStatus;

import java.nio.charset.StandardCharsets;
import java.time.Instant;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ActivationService {

    private final AccountTokenRepository accountTokenRepository;
    private final UserRepository userRepository;
    private final TokenService tokenService;
    private final PasswordEncoder passwordEncoder;

    public ActivationService(
            AccountTokenRepository accountTokenRepository,
            UserRepository userRepository,
            TokenService tokenService,
            PasswordEncoder passwordEncoder) {

        this.accountTokenRepository = accountTokenRepository;
        this.userRepository = userRepository;
        this.tokenService = tokenService;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional 
    public void activate(ActivateAccountRequest request){
        if(request.password().getBytes(StandardCharsets.UTF_8).length > 72){
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Ο κωδικός υπερβαίνει το όριο των 72 bytes του BCrypt"
            );
        }

        String tokenHash = tokenService.hashToken(request.token());

        AccountToken token = accountTokenRepository
            .findByTokenHashForUpdate(tokenHash)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Μη έγκυρη ή ληγμένη πρόσκληση"
            ));

        User student = userRepository.findByIdForUpdate(token.getUserId())
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Μη έγκυρη ή ληγμένη πρόσκληση"
            ));

        Instant now = Instant.now();

        if(token.getPurpose() != TokenPurpose.INVITATION
            || !token.isUsableAt(now)
            || student.getRole() != Role.STUDENT
            || student.getStatus() != UserStatus.INVITED){
                throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Μη έγκυρη ή ληγμένη πρόσκληση"
                );
            }

        String passwordHash = passwordEncoder.encode(request.password());

        student.activate(passwordHash);
        token.markUsedAt(now);
    }
}