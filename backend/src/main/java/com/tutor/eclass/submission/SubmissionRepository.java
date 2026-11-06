package com.tutor.eclass.submission;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;

public interface SubmissionRepository
        extends JpaRepository<Submission, UUID> {

    boolean existsByAssignmentId(UUID assignmentId);

    Optional<Submission> findByAssignmentId(UUID assignmentId);

    @Query("""
        SELECT new com.tutor.eclass.submission.PendingReviewResponse(
            s.id, a.id, u.fullName, a.title, c.id, c.title, s.submittedAt
        )
        FROM Submission s, Assignment a, Course c, User u
        WHERE s.assignmentId = a.id
            AND a.courseId = c.id
            AND s.studentId = u.id
            AND s.reviewedAt IS NULL
        ORDER BY s.submittedAt ASC, s.id ASC
    """)
    List<PendingReviewResponse> findPendingReviews();

    @Query("""
        SELECT new com.tutor.eclass.submission.RecentReviewResponse(
            a.id, a.title, c.id, c.title, s.reviewedAt   
        )
        FROM Submission s, Assignment a, Course c
        WHERE s.assignmentId = a.id  
            AND a.courseId = c.id   
            AND s.studentId = :studentId
            AND c.studentId = :studentId
            AND s.reviewedAt IS NOT NULL
        ORDER BY s.reviewedAt DESC, s.id ASC
    """)
    List<RecentReviewResponse> findRecentReviewForStudent(
        @Param("studentId") UUID studentId,
        Pageable pageable
    );
}