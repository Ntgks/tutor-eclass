package com.tutor.eclass.submission;

import java.time.Instant;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "submission_files")
public class SubmissionFile {

    @Id
    private UUID id;

    @Column(name = "submission_id", nullable = false)
    private UUID submissionId;

    @Column(name = "file_key", nullable = false, unique = true, length = 512)
    private String fileKey;

    @Column(name = "original_filename", nullable = false, length = 255)
    private String originalFilename;

    @Column(name = "content_type", nullable = false, length = 127)
    private String contentType;

    @Column(name = "size_bytes", nullable = false)
    private long sizeBytes;

    @Column(name = "created_at", nullable = false,
            insertable = false, updatable = false)
    private Instant createdAt;

    protected SubmissionFile() {
    }

    public static SubmissionFile create(
            UUID submissionId,
            String fileKey,
            String originalFilename,
            String contentType,
            long sizeBytes) {

        SubmissionFile file = new SubmissionFile();
        file.id = UUID.randomUUID();
        file.submissionId = submissionId;
        file.fileKey = fileKey;
        file.originalFilename = originalFilename;
        file.contentType = contentType;
        file.sizeBytes = sizeBytes;

        return file;
    }

    public UUID getId() {
        return id;
    }

    public UUID getSubmissionId() {
        return submissionId;
    }

    public String getFileKey() {
        return fileKey;
    }

    public String getOriginalFilename() {
        return originalFilename;
    }

    public String getContentType() {
        return contentType;
    }

    public long getSizeBytes() {
        return sizeBytes;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}