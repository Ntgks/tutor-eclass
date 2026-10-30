package com.tutor.eclass;

import java.util.UUID;

import com.tutor.eclass.config.SecurityConfig;
import com.tutor.eclass.submission.SubmissionController;
import com.tutor.eclass.submission.SubmissionService;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.verifyNoInteractions;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(SubmissionController.class)
@Import(SecurityConfig.class)
class SubmissionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private SubmissionService submissionService;

    @Test
    @WithMockUser(roles = "STUDENT")
    void studentCannotReviewSubmission() throws Exception {
        mockMvc.perform(put(
                "/api/courses/{courseId}/assignments/{assignmentId}/submissions/review",
                UUID.randomUUID(),
                UUID.randomUUID())
                .with(csrf())
                .contentType("application/json")
                .content("""
                    {
                        "feedback": "Test feedback"
                    }
                    """))
            .andExpect(status().isForbidden());

        verifyNoInteractions(submissionService);
    }
}