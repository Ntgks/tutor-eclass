package com.tutor.eclass.assignment;

import java.time.Instant;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity 
@Table(name = "assignments")
public class Assignment {
    
    @Id 
    private UUID id;

    @Column(name = "course_id", nullable = false)
    private UUID courseId;

    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @Column(name = "instructions", columnDefinition = "text")
    private String instructions;

    @Column(name = "due_at")
    private Instant dueAt;

    @Column(name = "created_at", nullable = false,
        insertable = false, updatable = false)
    private Instant createdAt;

    protected Assignment(){
    }

    public static Assignment create(
        UUID courseId,
        String title,
        String instructions,
        Instant dueAt){
            Assignment assignment = new Assignment();
            assignment.id = UUID.randomUUID();
            assignment.courseId = courseId;
            assignment.title = title;
            assignment.instructions = instructions;
            assignment.dueAt = dueAt;

            return assignment;
    }

    public UUID getId() {
        return id;
    }

    public UUID getCourseId() {
        return courseId;
    }

    public String getTitle() {
        return title;
    }

    public String getInstructions() {
        return instructions;
    }

    public Instant getDueAt() {
        return dueAt;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void updateDetails(
        String title,
        String instructions,
        Instant dueAt){

            if(title == null || title.isBlank()){
                throw new IllegalArgumentException(
                    "Απαιτείται τίτλος εργασίας"
                );
            }

            this.title = title.strip();
            this.instructions = instructions == null || instructions.isBlank()
                ? null
                : instructions.strip();
            this.dueAt = dueAt;
        }
}
