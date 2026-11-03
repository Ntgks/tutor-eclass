package com.tutor.eclass.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ForgotPasswordRequest(
    @NotBlank
    @Email
    @Size(max = 320)
    String email
) {
}