CREATE TABLE materials (
    id UUID PRIMARY KEY,
    course_id UUID NOT NULL REFERENCES courses(id),
    title VARCHAR(200) NOT NULL,
    file_key VARCHAR(512) NOT NULL UNIQUE,
    original_filename VARCHAR(255) NOT NULL,
    content_type VARCHAR(127) NOT NULL,
    size_bytes BIGINT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_material_title
        CHECK (length(trim(title)) > 0),

    CONSTRAINT chk_material_size
        CHECK (size_bytes > 0)
);

CREATE INDEX idx_materials_course_id
    ON materials(course_id);