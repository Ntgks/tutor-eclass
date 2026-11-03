package com.tutor.eclass.auth;

public record PreparedPasswordReset(
    String recipientEmail,
    String fullName,
    String resetUrl
) {
}