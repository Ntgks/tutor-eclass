package com.tutor.eclass;

import com.tutor.eclass.config.SecurityConfig;
import com.tutor.eclass.user.AuthController;
import com.tutor.eclass.user.ChangePasswordRequest;
import com.tutor.eclass.user.CurrentUserService;
import com.tutor.eclass.user.UserService;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AuthController.class)
@Import(SecurityConfig.class)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private CurrentUserService currentUserService;

    @MockitoBean
    private UserService userService;

    private static final String VALID_REQUEST = """
        {
            "currentPassword": "old-password-123",
            "newPassword": "new-password-123"
        }
        """;

    @Test
    void anonymousUserCannotChangePassword() throws Exception {
        mockMvc.perform(put("/api/auth/password")
                .with(csrf())
                .contentType("application/json")
                .content(VALID_REQUEST))
            .andExpect(status().isUnauthorized());

        verifyNoInteractions(userService);
    }

    @Test
    @WithMockUser(roles = "STUDENT")
    void requestWithoutCsrfIsRejected() throws Exception {
        mockMvc.perform(put("/api/auth/password")
                .contentType("application/json")
                .content(VALID_REQUEST))
            .andExpect(status().isForbidden());

        verifyNoInteractions(userService);
    }

    @Test
    @WithMockUser(roles = "STUDENT")
    void shortNewPasswordIsRejected() throws Exception {
        mockMvc.perform(put("/api/auth/password")
                .with(csrf())
                .contentType("application/json")
                .content("""
                    {
                        "currentPassword": "old-password-123",
                        "newPassword": "short"
                    }
                    """))
            .andExpect(status().isBadRequest());

        verifyNoInteractions(userService);
    }

    @Test
    @WithMockUser(roles = "STUDENT")
    void validRequestCallsService() throws Exception {
        mockMvc.perform(put("/api/auth/password")
                .with(csrf())
                .contentType("application/json")
                .content(VALID_REQUEST))
            .andExpect(status().isNoContent());

        verify(userService).changePassword(
            new ChangePasswordRequest(
                "old-password-123",
                "new-password-123"
            )
        );
    }
}