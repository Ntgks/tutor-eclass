CREATE TABLE submissions (
    id UUID PRIMARY KEY,
    assignment_id UUID NOT NULL UNIQUE REFERENCES assignments(id),
    student_id UUID NOT NULL REFERENCES users(id),
    student_comment TEXT,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    feedback TEXT,
    reviewed_at TIMESTAMPTZ
);

CREATE INDEX idx_submissions_student_id
    ON submissions(student_id);

CREATE TABLE submission_files (
    id UUID PRIMARY KEY,
    submission_id UUID NOT NULL REFERENCES submissions(id),
    file_key VARCHAR(512) NOT NULL UNIQUE,
    original_filename VARCHAR(255) NOT NULL,
    content_type VARCHAR(127) NOT NULL,
    size_bytes BIGINT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_submission_file_size
        CHECK (size_bytes > 0)
);

CREATE INDEX idx_submission_files_submission_id
    ON submission_files(submission_id);