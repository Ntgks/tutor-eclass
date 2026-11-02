package com.tutor.eclass.course;

import java.time.Instant;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity 
@Table(name = "courses")
public class Course {
    
    @Id 
    private UUID id;

    @Column(name = "student_id", nullable = false)
    private UUID studentId;

    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @Column(name = "description", columnDefinition = "text")
    private String description;

    @Column(name = "created_at", nullable = false,
        insertable = false, updatable = false)
    private Instant createdAt;

    protected Course(){
    }

    public static Course create(
        UUID studentId,
        String title,
        String description
    ){
        Course course = new Course();
        course.id = UUID.randomUUID();
        course.studentId = studentId;
        course.title = title;
        course.description = description;

        return course;
    }

    public UUID getId() {
        return id;
    }

    public UUID getStudentId() {
        return studentId;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void updateDetails(String title, String description){
        if (title == null || title.isBlank()) {
            throw new IllegalArgumentException(
                "Απαιτείται τίτλος μαθήματος"
            );
        }

        this.title = title.strip();
        this.description = description == null || description.isBlank() 
        ? null
        : description.strip();
    }
}
