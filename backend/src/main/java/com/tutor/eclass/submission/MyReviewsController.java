package com.tutor.eclass.submission;

import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tutor.eclass.user.CurrentUserService;
import org.springframework.web.bind.annotation.GetMapping;


@RestController 
@RequestMapping("/api/me/reviews")
@PreAuthorize("hasRole('STUDENT')")
public class MyReviewsController {
    
    private final SubmissionRepository submissionRepository;
    private final CurrentUserService currentUserService;

    public MyReviewsController(
        SubmissionRepository submissionRepository,
        CurrentUserService currentUserService){
            this.submissionRepository = submissionRepository;
            this.currentUserService = currentUserService;
    }

    @GetMapping("/recent")
    public List<RecentReviewResponse> getRecentReviews(){
        var studentId = currentUserService.getCurrentUser().getId();
        return submissionRepository.findRecentReviewForStudent(
            studentId,
            PageRequest.of(0, 5)
        );
    }
    
}
