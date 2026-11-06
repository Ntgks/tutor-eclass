package com.tutor.eclass.assignment;

import java.time.Instant;
import java.util.UUID;

public record UpcomingAssignmentResponse(
    UUID assignmentId,
    String assignmentTitle,
    UUID courseId,
    String courseTitle,
    Instant dueAt
){
}