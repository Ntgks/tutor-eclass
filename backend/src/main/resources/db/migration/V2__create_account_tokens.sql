CREATE TABLE account_tokens (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id),
    token_hash VARCHAR(64) NOT NULL UNIQUE,
    purpose VARCHAR(20) NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_token_purpose
        CHECK (purpose IN ('INVITATION', 'PASSWORD_RESET')),

    CONSTRAINT chk_token_expiry
        CHECK (expires_at > created_at)
);

CREATE INDEX idx_account_tokens_user_id
    ON account_tokens(user_id);