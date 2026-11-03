package com.tutor.eclass.auth;

public record InvitationResponse(
    String activationUrl,
    boolean emailSent
) {
}