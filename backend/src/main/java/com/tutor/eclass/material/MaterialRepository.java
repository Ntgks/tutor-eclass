package com.tutor.eclass.material;

import java.util.List;
import java.util.UUID;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface MaterialRepository
        extends JpaRepository<Material, UUID> {

    List<Material> findAllByCourseIdOrderByCreatedAtDesc(UUID courseId);

    Optional<Material> findByIdAndCourseId(UUID id, UUID courseId);
}