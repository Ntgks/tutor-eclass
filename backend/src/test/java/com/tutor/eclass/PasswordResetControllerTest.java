package com.tutor.eclass;

import java.util.Optional;

import com.tutor.eclass.auth.PasswordResetController;
import com.tutor.eclass.auth.PasswordResetService;
import com.tutor.eclass.auth.PreparedPasswordReset;
import com.tutor.eclass.auth.ResetPasswordRequest;
import com.tutor.eclass.config.SecurityConfig;
import com.tutor.eclass.mail.PasswordResetMailService;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpStatus;
import org.springframework.mail.MailSendException;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.server.ResponseStatusException;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(PasswordResetController.class)
@Import(SecurityConfig.class)
class PasswordResetControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private PasswordResetService passwordResetService;

    @MockitoBean
    private PasswordResetMailService passwordResetMailService;

    @Test
    void unknownEmailReturnsNoContent() throws Exception {
        when(passwordResetService.preparePasswordReset(any()))
            .thenReturn(Optional.empty());

        mockMvc.perform(post("/api/auth/forgot-password")
                .with(csrf())
                .contentType("application/json")
                .content("""
                    {"email": "unknown@example.com"}
                    """))
            .andExpect(status().isNoContent())
            .andExpect(content().string(""));

        verifyNoInteractions(passwordResetMailService);
    }

    @Test
    void knownEmailSendsMailWithoutExposingResetUrl() throws Exception {
        PreparedPasswordReset prepared = new PreparedPasswordReset(
            "student@example.com",
            "Test Student",
            "http://localhost:3000/reset-password?token=test"
        );

        when(passwordResetService.preparePasswordReset(any()))
            .thenReturn(Optional.of(prepared));

        mockMvc.perform(post("/api/auth/forgot-password")
                .with(csrf())
                .contentType("application/json")
                .content("""
                    {"email": "student@example.com"}
                    """))
            .andExpect(status().isNoContent())
            .andExpect(content().string(""));

        verify(passwordResetMailService).sendPasswordReset(
            prepared.recipientEmail(),
            prepared.fullName(),
            prepared.resetUrl()
        );
    }

    @Test
    void mailFailureStillReturnsNoContent() throws Exception {
        PreparedPasswordReset prepared = new PreparedPasswordReset(
            "student@example.com",
            "Test Student",
            "http://localhost:3000/reset-password?token=test"
        );

        when(passwordResetService.preparePasswordReset(any()))
            .thenReturn(Optional.of(prepared));

        doThrow(new MailSendException("SMTP unavailable"))
            .when(passwordResetMailService)
            .sendPasswordReset(
                prepared.recipientEmail(),
                prepared.fullName(),
                prepared.resetUrl()
            );

        mockMvc.perform(post("/api/auth/forgot-password")
                .with(csrf())
                .contentType("application/json")
                .content("""
                    {"email": "student@example.com"}
                    """))
            .andExpect(status().isNoContent())
            .andExpect(content().string(""));
    }

    @Test
    void forgotPasswordRequiresCsrf() throws Exception {
        mockMvc.perform(post("/api/auth/forgot-password")
                .contentType("application/json")
                .content("""
                    {"email": "student@example.com"}
                    """))
            .andExpect(status().isForbidden());

        verifyNoInteractions(
            passwordResetService,
            passwordResetMailService
        );
    }

    @Test
    void invalidResetReturnsBadRequestWithoutLogin() throws Exception {
        doThrow(new ResponseStatusException(HttpStatus.BAD_REQUEST))
            .when(passwordResetService)
            .resetPassword(any(ResetPasswordRequest.class));

        mockMvc.perform(post("/api/auth/reset-password")
                .with(csrf())
                .contentType("application/json")
                .content("""
                    {
                        "token": "%s",
                        "password": "NewPassword123!"
                    }
                    """.formatted("a".repeat(43))))
            .andExpect(status().isBadRequest());
    }
}