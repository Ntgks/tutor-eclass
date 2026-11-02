package com.tutor.eclass.course;

import java.util.UUID;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/courses")
@PreAuthorize("hasAnyRole('TEACHER', 'STUDENT')")
public class CourseDetailsController {

    private final CourseService courseService;

    public CourseDetailsController(CourseService courseService) {
        this.courseService = courseService;
    }

    @GetMapping("/{courseId}")
    public CourseResponse getCourse(@PathVariable UUID courseId) {
        return courseService.getCourse(courseId);
    }

    @PutMapping("/{courseId}")
    @PreAuthorize("hasRole('TEACHER')")
    public CourseResponse updateCourse(
        @PathVariable UUID courseId,
        @Valid @RequestBody UpdateCourseRequest request) {

            return courseService.updateCourse(
                courseId,
                request
            );
    }

    @PutMapping("/{courseId}/archive")
    @PreAuthorize("hasRole('TEACHER')")
    public CourseResponse archiveCourse(
            @PathVariable UUID courseId) {

        return courseService.archiveCourse(courseId);
    }

    @PutMapping("/{courseId}/restore")
    @PreAuthorize("hasRole('TEACHER')")
    public CourseResponse restoreCourse(
            @PathVariable UUID courseId) {

        return courseService.restoreCourse(courseId);
    }

}