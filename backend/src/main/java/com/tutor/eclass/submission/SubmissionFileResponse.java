package com.tutor.eclass.submission;

import java.util.UUID;

public record SubmissionFileResponse(
    UUID id,
    String originalFilename,
    String contentType,
    long sizeBytes
) {
}