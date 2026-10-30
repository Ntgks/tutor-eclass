package com.tutor.eclass.submission;

import jakarta.validation.constraints.Size;

public record CreateSubmissionRequest(

    @Size(max = 5000)
    String studentComment

) {
}