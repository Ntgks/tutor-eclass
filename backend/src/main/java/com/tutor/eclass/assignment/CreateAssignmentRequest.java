package com.tutor.eclass.assignment;

import java.time.Instant;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateAssignmentRequest(

    @NotBlank
    @Size(max = 200)
    String title,

    @Size(max = 10000)
    String instructions,

    @Future
    Instant dueAt

) {
}