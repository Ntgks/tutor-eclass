package com.tutor.eclass.assignment;

import java.util.List;
import java.util.UUID;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/courses/{courseId}/assignments")
@PreAuthorize("hasAnyRole('TEACHER', 'STUDENT')")
public class AssignmentController {

    private final AssignmentService assignmentService;

    public AssignmentController(AssignmentService assignmentService) {
        this.assignmentService = assignmentService;
    }

    @GetMapping
    public List<AssignmentResponse> getAssignments(
            @PathVariable UUID courseId) {

        return assignmentService.getAssignments(courseId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('TEACHER')")
    public AssignmentResponse createAssignment(
            @PathVariable UUID courseId,
            @Valid @RequestBody CreateAssignmentRequest request) {

        return assignmentService.createAssignment(
            courseId,
            request
        );
    }
}