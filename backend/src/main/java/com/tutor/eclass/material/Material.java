package com.tutor.eclass.material;

import java.time.Instant;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity 
@Table(name = "materials")
public class Material {
    
    @Id
    private UUID id;

    @Column(name = "course_id", nullable = false)
    private UUID courseId;

    @Column(name = "title", nullable = false, length = 200)
    private String title;

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
    
    protected Material(){
    }

    public static Material create(
            UUID courseId,
            String title,
            String fileKey,
            String originalFilename,
            String contentType,
            long sizeBytes) {

        Material material = new Material();
        material.id = UUID.randomUUID();
        material.courseId = courseId;
        material.title = title;
        material.fileKey = fileKey;
        material.originalFilename = originalFilename;
        material.contentType = contentType;
        material.sizeBytes = sizeBytes;

        return material;
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
