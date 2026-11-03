package com.tutor.eclass.user;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

import org.springframework.security.core.Authentication;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.GetMapping;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;

@RestController 
@RequestMapping("/api/auth")
public class AuthController {

    private final CurrentUserService currentUserService;
    private final UserService userService;

    public AuthController(
        CurrentUserService currentUserService,
        UserService userService){

            this.userService = userService;
            this.currentUserService = currentUserService;
    }

    @GetMapping("/me")
    public Map<String, Object> me(Authentication authentication) {
        User user = currentUserService.getCurrentUser();

        return Map.of(
            "email", user.getEmail(),
            "authorities", authentication.getAuthorities()
                .stream()
                .map(authority -> authority.getAuthority())
                .toList()
        );
    }

    @GetMapping("/csrf")
    public CsrfToken csrf(CsrfToken csrfToken){
        return csrfToken;
    } 

    @PutMapping("/password")
    @ResponseStatus (HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAnyRole('TEACHER', 'STUDENT')")
    public void changePassword(
        @Valid @RequestBody ChangePasswordRequest request){

            userService.changePassword(request);
    }
}
