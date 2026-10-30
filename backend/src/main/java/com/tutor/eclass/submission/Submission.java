package com.tutor.eclass.submission;

import java.time.Instant;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import org.hibernate.annotations.Generated;
import org.hibernate.generator.EventType;

@Entity
@Table(name = "submissions")
public class Submission {

    @Id
    private UUID id;

    @Column(name = "assignment_id", nullable = false, unique = true)
    private UUID assignmentId;

    @Column(name = "student_id", nullable = false)
    private UUID studentId;

    @Column(name = "student_comment", columnDefinition = "text")
    private String studentComment;

    @Generated(event = EventType.INSERT)
    @Column(name = "submitted_at", nullable = false,
            insertable = false, updatable = false)
    private Instant submittedAt;

    @Column(name = "feedback", columnDefinition = "text")
    private String feedback;

    @Column(name = "reviewed_at")
    private Instant reviewedAt;

    protected Submission() {
    }

    public static Submission create(
            UUID assignmentId,
            UUID studentId,
            String studentComment) {

        Submission submission = new Submission();
        submission.id = UUID.randomUUID();
        submission.assignmentId = assignmentId;
        submission.studentId = studentId;
        submission.studentComment = studentComment;

        return submission;
    }

    public UUID getId() {
        return id;
    }

    public UUID getAssignmentId() {
        return assignmentId;
    }

    public UUID getStudentId() {
        return studentId;
    }

    public String getStudentComment() {
        return studentComment;
    }

    public Instant getSubmittedAt() {
        return submittedAt;
    }

    public String getFeedback() {
        return feedback;
    }

    public Instant getReviewedAt() {
        return reviewedAt;
    }

    public void review(String feedback, Instant now){
        if(feedback == null || feedback.isBlank()){
            throw new IllegalArgumentException(
                "Απαιτούνται σχόλια διόρθωσης"
            );
        }

        if(now == null){
            throw new IllegalArgumentException(
                "Απαιτείται ημερομηνία διόρθωσης"
            );
        }

        this.feedback = feedback.strip();
        this.reviewedAt = now;
    }
}