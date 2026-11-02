package com.tutor.eclass;

import com.tutor.eclass.assignment.AssignmentController;
import com.tutor.eclass.assignment.AssignmentService;
import com.tutor.eclass.config.SecurityConfig;

import java.util.UUID;

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

@WebMvcTest(AssignmentController.class)
@Import(SecurityConfig.class)
class AssignmentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private AssignmentService assignmentService;

    @Test
    @WithMockUser(roles = "STUDENT")
    void studentCannotUpdateAssignment() throws Exception {
        UUID courseId = UUID.randomUUID();
        UUID assignmentId = UUID.randomUUID();

        mockMvc.perform(put(
                "/api/courses/{courseId}/assignments/{assignmentId}",
                courseId,
                assignmentId
            )
                .with(csrf())
                .contentType("application/json")
                .content("""
                    {
                        "title": "Αλλαγμένος τίτλος",
                        "instructions": null,
                        "dueAt": null
                    }
                    """))
            .andExpect(status().isForbidden());

        verifyNoInteractions(assignmentService);
    }
}