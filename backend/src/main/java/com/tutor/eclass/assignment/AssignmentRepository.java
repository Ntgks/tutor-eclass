package com.tutor.eclass.assignment;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

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
}