package com.tutor.eclass.auth;

public record PreparedInvitation(
    String recipientEmail,
    String fullName,
    String activationUrl
) {
}