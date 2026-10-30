package com.tutor.eclass.user;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

import org.springframework.security.core.Authentication;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.GetMapping;


@RestController 
@RequestMapping("/api/auth")
public class AuthController {

    private final CurrentUserService currentUserService;

    public AuthController(CurrentUserService currentUserService) {
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
    
    
}
