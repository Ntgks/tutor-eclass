package com.tutor.eclass.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateStudentRequest(

    @NotBlank
    @Size(max = 200)
    String fullName,

    @NotBlank
    @Email
    @Size(max = 320)
    String email,

    @Size(max = 100)
    String educationLevel

) {
}