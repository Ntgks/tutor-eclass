package com.tutor.eclass.course;

import java.util.UUID;

public record CourseResponse(
    UUID id,
    UUID studentId,
    String title,
    String description,
    boolean archived
) {
}