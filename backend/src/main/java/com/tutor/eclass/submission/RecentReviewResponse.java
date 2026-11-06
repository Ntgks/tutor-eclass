package com.tutor.eclass.submission;

import java.time.Instant;
import java.util.UUID;

public record RecentReviewResponse(
    UUID assignmentId,
    String assignmentTitle,
    UUID courseId,
    String courseTitle,
    Instant reviewedAt
){
}