package com.tutor.eclass.course;

import java.util.UUID;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}