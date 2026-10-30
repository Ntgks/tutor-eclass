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

import java.nio.charset.StandardCharsets;

import org.springframework.core.io.Resource;
import org.springframework.http.CacheControl;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

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

    @GetMapping("/files/{fileId}/download")
    public ResponseEntity<Resource> downloadSubmissionFile(
        @PathVariable UUID courseId,
        @PathVariable UUID assignmentId,
        @PathVariable UUID fileId,
        Authentication authentication){
            
            SubmissionFileDownload download = 
                submissionService.downloadSubmissionFile(
                    courseId,
                    assignmentId,
                    fileId,
                    authentication.getName()
                );

            String disposition = ContentDisposition.attachment()
                .filename(download.originalFilename(), StandardCharsets.UTF_8)
                .build()
                .toString();
            
            return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .cacheControl(CacheControl.noStore())
                .header(HttpHeaders.CONTENT_DISPOSITION, disposition)
                .body(download.resource());


    }

    @PutMapping("/review")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('TEACHER')")
    public void reviewSubmission(
        @PathVariable UUID courseId,
        @PathVariable UUID assignmentId,
        @Valid @RequestBody ReviewSubmissionRequest request,
        Authentication authentication){
            
            submissionService.reviewSubmission(
                courseId, 
                assignmentId, 
                request, 
                authentication.getName()
            );
    }
}