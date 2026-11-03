package com.tutor.eclass.auth;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.mail.MailException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.tutor.eclass.mail.InvitationMailService;

@RestController
@RequestMapping("/api/students")
public class InvitationController {

    private final InvitationService invitationService;
    private final InvitationMailService invitationMailService;

    public InvitationController(
            InvitationService invitationService,
            InvitationMailService invitationMailService) {

        this.invitationService = invitationService;
        this.invitationMailService = invitationMailService;
    }

    @PostMapping("/{studentId}/invitation")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('TEACHER')")
    public InvitationResponse createInvitation(
            @PathVariable UUID studentId) {

        PreparedInvitation invitation =
            invitationService.createInvitation(studentId);

        boolean emailSent;

        try {
            invitationMailService.sendInvitation(
                invitation.recipientEmail(),
                invitation.fullName(),
                invitation.activationUrl()
            );

            emailSent = true;
        } catch (MailException exception) {
            emailSent = false;
        }

        return new InvitationResponse(
            invitation.activationUrl(),
            emailSent
        );
    }
}