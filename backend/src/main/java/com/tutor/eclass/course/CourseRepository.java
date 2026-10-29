package com.tutor.eclass.course;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseRepository extends JpaRepository<Course, UUID> {
    
    List<Course> findAllByStudentId(UUID studentId);

    Optional<Course> findByIdAndStudentId(UUID id, UUID studentId);
}
