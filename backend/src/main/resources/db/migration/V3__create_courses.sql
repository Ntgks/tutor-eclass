CREATE TABLE courses (
    id UUID PRIMARY KEY,
    student_id UUID NOT NULL REFERENCES users(id),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_course_title
        CHECK (length(trim(title)) > 0)
);

CREATE INDEX idx_courses_student_id
    ON courses(student_id);