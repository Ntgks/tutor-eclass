package com.tutor.eclass.submission;

import java.time.Instant;
import java.util.UUID;

public record PendingReviewResponse(
    UUID submissionId,
    String studentName,
    String assignmentTitle,
    UUID courseId,
    String courseTitle,
    Instant submittedAt
){
}