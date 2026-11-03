package com.tutor.eclass;

import com.tutor.eclass.auth.InvitationController;
import com.tutor.eclass.auth.InvitationService;
import com.tutor.eclass.auth.PreparedInvitation;
import com.tutor.eclass.config.SecurityConfig;
import com.tutor.eclass.mail.InvitationMailService;

import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.mail.MailSendException;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(InvitationController.class)
@Import(SecurityConfig.class)
class InvitationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private InvitationService invitationService;

    @MockitoBean
    private InvitationMailService invitationMailService;

    private static final String EMAIL = "student@example.com";
    private static final String NAME = "Test Student";
    private static final String URL =
        "http://localhost:3000/activate?token=test-token";

    @Test
    @WithMockUser(roles = "TEACHER")
    void successfulEmailReturnsLinkAndTrue() throws Exception {
        UUID studentId = UUID.randomUUID();

        given(invitationService.createInvitation(studentId))
            .willReturn(new PreparedInvitation(EMAIL, NAME, URL));

        mockMvc.perform(post(
                "/api/students/{studentId}/invitation",
                studentId
            ).with(csrf()))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.activationUrl").value(URL))
            .andExpect(jsonPath("$.emailSent").value(true));

        verify(invitationMailService)
            .sendInvitation(EMAIL, NAME, URL);
    }

    @Test
    @WithMockUser(roles = "TEACHER")
    void failedEmailStillReturnsActivationLink() throws Exception {
        UUID studentId = UUID.randomUUID();

        given(invitationService.createInvitation(studentId))
            .willReturn(new PreparedInvitation(EMAIL, NAME, URL));

        doThrow(new MailSendException("SMTP unavailable"))
            .when(invitationMailService)
            .sendInvitation(EMAIL, NAME, URL);

        mockMvc.perform(post(
                "/api/students/{studentId}/invitation",
                studentId
            ).with(csrf()))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.activationUrl").value(URL))
            .andExpect(jsonPath("$.emailSent").value(false));

        verify(invitationMailService)
            .sendInvitation(EMAIL, NAME, URL);
    }

    @Test
    @WithMockUser(roles = "STUDENT")
    void studentCannotSendInvitation() throws Exception {
        UUID studentId = UUID.randomUUID();

        mockMvc.perform(post(
                "/api/students/{studentId}/invitation",
                studentId
            ).with(csrf()))
            .andExpect(status().isForbidden());

        verifyNoInteractions(invitationService, invitationMailService);
    }
}