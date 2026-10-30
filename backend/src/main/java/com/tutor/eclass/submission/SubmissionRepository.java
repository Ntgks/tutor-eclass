package com.tutor.eclass.submission;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

public interface SubmissionRepository
        extends JpaRepository<Submission, UUID> {

    boolean existsByAssignmentId(UUID assignmentId);

    Optional<Submission> findByAssignmentId(UUID assignmentId);
}