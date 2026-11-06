package com.tutor.eclass.assignment;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.time.Instant;

import org.springframework.data.jpa.repository.JpaRepository;

import jakarta.persistence.LockModeType;

import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AssignmentRepository
    extends JpaRepository<Assignment, UUID> {

        List<Assignment> findAllByCourseIdOrderByCreatedAtDesc(UUID courseId);

        Optional<Assignment> findByIdAndCourseId(
            UUID id,
            UUID courseId
        );

        @Lock(LockModeType.PESSIMISTIC_WRITE)
        @Query("""
            SELECT a FROM Assignment a
            WHERE a.id = :id AND a.courseId = :courseId
        """)
        Optional<Assignment> findByIdAndCourseIdForUpdate(
            @Param("id") UUID id,
            @Param("courseId") UUID courseId
        );

        @Query("""
            SELECT new com.tutor.eclass.assignment.UpcomingAssignmentResponse(
                a.id, a.title, c.id, c.title, a.dueAt
            )
            FROM Assignment a, Course c
            WHERE a.courseId = c.id 
                AND c.studentId = :studentId
                AND c.archived = false
                AND a.dueAt > :now
                AND NOT EXISTS (
                    SELECT s.id
                    FROM Submission s
                    WHERE s.assignmentId = a.id
                        AND s.studentId = :studentId
                )
            ORDER BY a.dueAt ASC, a.id ASC    
        """)
        List<UpcomingAssignmentResponse> findUpcomingAssignments(
            @Param("studentId") UUID studentId,
            @Param("now") Instant now
        );
}