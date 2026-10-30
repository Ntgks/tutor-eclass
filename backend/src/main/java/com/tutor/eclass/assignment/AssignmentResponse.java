package com.tutor.eclass.assignment;

import java.time.Instant;
import java.util.UUID;

public record AssignmentResponse(
    UUID id,
    UUID courseId,
    String title,
    String instructions,
    Instant dueAt
) {
}