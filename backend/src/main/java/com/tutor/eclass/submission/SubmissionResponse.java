package com.tutor.eclass.submission;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record SubmissionResponse(
    UUID id,
    UUID assignmentId,
    UUID studentId,
    String studentComment,
    Instant submittedAt,
    String feedback,
    Instant reviewedAt,
    List<SubmissionFileResponse> files
) {
}