package com.tutor.eclass.auth;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;


@RestController 
@RequestMapping("/api/students")
public class InvitationController {
    
    private final InvitationService invitationService;
    private final String frontedUrl;

    public InvitationController(
        InvitationService invitationService,
        @Value("${app.frontend-url:http://localhost:3000}") 
        String frontedUrl){
            this.invitationService = invitationService;
            this.frontedUrl = frontedUrl;
        }

    @PostMapping("/{studentId}/invitation")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('TEACHER')")
    public InvitationResponse createInvitation(
        @PathVariable UUID studentId){
            String token = invitationService.createInvitation(studentId);

            String activationUrl = frontedUrl.replaceAll("/+$", "")
                + "/activate?token=" + token ;
            
                return new InvitationResponse(activationUrl);
        }
    
}
