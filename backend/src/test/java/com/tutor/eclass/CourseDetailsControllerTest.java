package com.tutor.eclass;

import com.tutor.eclass.config.SecurityConfig;
import com.tutor.eclass.course.CourseDetailsController;
import com.tutor.eclass.course.CourseService;

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

@WebMvcTest(CourseDetailsController.class)
@Import(SecurityConfig.class)
class CourseDetailsControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private CourseService courseService;

    @Test
    @WithMockUser(roles = "STUDENT")
    void studentCannotUpdateCourse() throws Exception {
        UUID courseId = UUID.randomUUID();

        mockMvc.perform(put("/api/courses/{courseId}", courseId)
                .with(csrf())
                .contentType("application/json")
                .content("""
                    {
                        "title": "Αλλαγμένος τίτλος",
                        "description": "Δοκιμαστική περιγραφή"
                    }
                    """))
            .andExpect(status().isForbidden());

        verifyNoInteractions(courseService);
    }

    @Test
    @WithMockUser(roles = "STUDENT")
    void studentCannotArchiveCourse() throws Exception {
        UUID courseId = UUID.randomUUID();

        mockMvc.perform(put("/api/courses/{courseId}/archive", courseId)
                .with(csrf()))
            .andExpect(status().isForbidden());

        verifyNoInteractions(courseService);
    }

    @Test
    @WithMockUser(roles = "STUDENT")
    void studentCannotRestoreCourse() throws Exception {
        UUID courseId = UUID.randomUUID();

        mockMvc.perform(put("/api/courses/{courseId}/restore", courseId)
                .with(csrf()))
            .andExpect(status().isForbidden());

        verifyNoInteractions(courseService);
    }
}