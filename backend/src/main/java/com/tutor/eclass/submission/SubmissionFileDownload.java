package com.tutor.eclass.submission;

import org.springframework.core.io.Resource;

public record SubmissionFileDownload(
    Resource resource,
    String originalFilename
) {
}