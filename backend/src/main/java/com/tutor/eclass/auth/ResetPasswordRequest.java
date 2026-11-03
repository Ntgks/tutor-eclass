package com.tutor.eclass.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ResetPasswordRequest(
    @NotBlank
    @Pattern(regexp = "^[A-Za-z0-9_-]{43}$")
    String token,

    @NotBlank
    @Size(min = 12, max = 64)
    String password
) {
}