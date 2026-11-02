package com.tutor.eclass.assignment;

import java.time.Instant;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateAssignmentRequest(
    @NotBlank
    @Size(max = 200)
    String title,

    @Size(max = 10000)
    String instructions,

    Instant dueAt
) {
}