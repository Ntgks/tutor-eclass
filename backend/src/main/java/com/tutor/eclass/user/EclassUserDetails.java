package com.tutor.eclass.user;

import java.util.List;
import java.util.UUID;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;

public class EclassUserDetails extends User {

    private static final long serialVersionUID = 1L;

    private final UUID userId;

    public EclassUserDetails(
            UUID userId,
            String email,
            String passwordHash,
            Role role) {

        super(
            email,
            passwordHash,
            List.of(new SimpleGrantedAuthority("ROLE_" + role.name()))
        );

        this.userId = userId;
    }

    public UUID getUserId() {
        return userId;
    }
}