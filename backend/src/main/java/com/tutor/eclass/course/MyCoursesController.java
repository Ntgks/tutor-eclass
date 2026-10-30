package com.tutor.eclass.course;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/me/courses")
@PreAuthorize("hasRole('STUDENT')")
public class MyCoursesController {

    private final CourseService courseService;

    public MyCoursesController(CourseService courseService) {
        this.courseService = courseService;
    }

    @GetMapping
    public List<CourseResponse> getMyCourses() {

        return courseService.getMyCourses();
    }
}