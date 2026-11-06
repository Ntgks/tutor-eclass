package com.tutor.eclass.assignment;

import java.time.Instant;
import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tutor.eclass.user.CurrentUserService;
import org.springframework.web.bind.annotation.GetMapping;


@RestController 
@RequestMapping("/api/me/assignments")
@PreAuthorize("hasRole('STUDENT')")
public class MyAssignmentsController {
    
    private final AssignmentRepository assignmentRepository;
    private final CurrentUserService currentUserService;

    public MyAssignmentsController(
        AssignmentRepository assignmentRepository,
        CurrentUserService currentUserService){
            this.assignmentRepository = assignmentRepository;
            this.currentUserService = currentUserService;
    }

    @GetMapping("/upcoming")
    public List<UpcomingAssignmentResponse> getUpcomingAssignments() {
        var studentId = currentUserService.getCurrentUser().getId();
        return assignmentRepository.findUpcomingAssignments(
            studentId,
            Instant.now()
        );
    }
    
}
