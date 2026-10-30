CREATE TABLE assignments (
    id UUID PRIMARY KEY,
    course_id UUID NOT NULL REFERENCES courses(id),
    title VARCHAR(200) NOT NULL,
    instructions TEXT,
    due_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_assignment_title
        CHECK (length(trim(title)) > 0)
);

CREATE INDEX idx_assignments_course_id
    ON assignments(course_id);