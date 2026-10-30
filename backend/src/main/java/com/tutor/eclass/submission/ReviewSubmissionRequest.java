package com.tutor.eclass.submission;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ReviewSubmissionRequest(

    @NotBlank
    @Size(max = 10000)
    String feedback

) {
}