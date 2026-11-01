package com.tutor.eclass;

import com.tutor.eclass.config.SecurityConfig;
import com.tutor.eclass.user.StudentController;
import com.tutor.eclass.user.UserService;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.security.test.context.support.WithMockUser;

import static org.mockito.Mockito.verifyNoInteractions;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.tutor.eclass.user.CreateStudentRequest;
import com.tutor.eclass.user.StudentResponse;
import com.tutor.eclass.user.UserStatus;
import java.util.UUID;

import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;

@WebMvcTest(StudentController.class)
@Import(SecurityConfig.class)
class StudentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private UserService userService;

    @Test
    @WithMockUser(roles = "STUDENT")
    void studentCannotCreateStudent() throws Exception {
        mockMvc.perform(post("/api/students")
                .with(csrf())
                .contentType("application/json")
                .content("""
                    {
                        "fullName": "Test Student",
                        "email": "student@example.com"
                    }
                    """))
            .andExpect(status().isForbidden());

        verifyNoInteractions(userService);
    }

    @Test
    @WithMockUser(roles = "TEACHER")
    void teacherCanCreateStudent() throws Exception {
        UUID id = UUID.randomUUID();

        CreateStudentRequest request = new CreateStudentRequest(
            "Test Student", "student@example.com", null
        );

        given(userService.createStudent(request))
            .willReturn(new StudentResponse(
                id,
                "Test Student",
                "student@example.com",
                UserStatus.INVITED,
                null
            ));

        mockMvc.perform(post("/api/students")
                .with(csrf())
                .contentType("application/json")
                .content("""
                    {
                        "fullName": "Test Student",
                        "email": "student@example.com"
                    }
                    """))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id").value(id.toString()))
            .andExpect(jsonPath("$.status").value("INVITED"))
            .andExpect(jsonPath("$.passwordHash").doesNotExist());

        verify(userService).createStudent(request);
    }

    @Test 
    @WithMockUser (roles = "STUDENT")
    void studentCannotDisableStudent() throws Exception {
        UUID studentId = UUID.randomUUID();

        mockMvc.perform(put("/api/students/" + studentId + "/disable")
                .with(csrf()))
            .andExpect(status().isForbidden());

        verifyNoInteractions(userService);
    }

    @Test 
    @WithMockUser(roles = "STUDENT")
    void studentCannotEnableStudent() throws Exception {
        UUID studentId = UUID.randomUUID();

        mockMvc.perform(put("/api/students/" + studentId + "/enable")
                .with(csrf()))
            .andExpect(status().isForbidden());

        verifyNoInteractions(userService);
    }
}