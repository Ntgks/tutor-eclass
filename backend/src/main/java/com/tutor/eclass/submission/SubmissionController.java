package com.tutor.eclass.submission;

import java.util.List;
import java.util.UUID;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping(
    "/api/courses/{courseId}/assignments/{assignmentId}/submissions"
)
@PreAuthorize("hasAnyRole('TEACHER', 'STUDENT')")
public class SubmissionController {

    private final SubmissionService submissionService;

    public SubmissionController(SubmissionService submissionService) {
        this.submissionService = submissionService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('STUDENT')")
    public SubmissionResponse createSubmission(
            @PathVariable UUID courseId,
            @PathVariable UUID assignmentId,
            @Valid @RequestPart("metadata") CreateSubmissionRequest request,
            @RequestPart("files") List<MultipartFile> files,
            Authentication authentication) {

        return submissionService.createSubmission(
            courseId,
            assignmentId,
            request,
            files,
            authentication.getName()
        );
    }

    @GetMapping
    public SubmissionResponse getSubmission(
            @PathVariable UUID courseId,
            @PathVariable UUID assignmentId,
            Authentication authentication) {

        return submissionService.getSubmission(
            courseId,
            assignmentId,
            authentication.getName()
        );
    }
}