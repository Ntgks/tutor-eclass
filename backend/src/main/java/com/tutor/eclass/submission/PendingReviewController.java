package com.tutor.eclass.submission;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tutor.eclass.user.CurrentUserService;
import org.springframework.web.bind.annotation.GetMapping;


@RestController 
@RequestMapping("/api/teacher/submissions")
@PreAuthorize("hasRole('TEACHER')")
public class PendingReviewController {
    
    private final SubmissionRepository submissionRepository;
    private final CurrentUserService currentUserService;

    public PendingReviewController(
        SubmissionRepository submissionRepository,
        CurrentUserService currentUserService){
            this.submissionRepository = submissionRepository;
            this.currentUserService = currentUserService;
    }

    @GetMapping("/pending-review")
    public List<PendingReviewResponse> getPendingReviews(){
        currentUserService.getCurrentUser();
        return submissionRepository.findPendingReviews();
    }
    
}
