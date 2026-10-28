package com.tutor.eclass.user;

import java.util.UUID;

public record StudentResponse(
    UUID id,
    String fullName,
    String email,
    UserStatus status,
    String educationLevel
){
}