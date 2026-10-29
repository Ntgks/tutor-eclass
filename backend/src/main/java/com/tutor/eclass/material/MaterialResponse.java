package com.tutor.eclass.material;

import java.util.UUID;

public record MaterialResponse(
    UUID id,
    UUID courseId,
    String title,
    String originalFilename,
    String contentType,
    long sizeBytes
) {
}