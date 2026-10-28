CREATE TABLE users(
    id UUID PRIMARY KEY,
    full_name VARCHAR(200) NOT NULL,
    email VARCHAR(320) NOT NULL UNIQUE,
    password_hash VARCHAR(255),
    role VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'INVITED',
    education_level VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_users_role
        CHECK(role IN('TEACHER', 'STUDENT')),

    CONSTRAINT chk_users_status
        CHECK(status IN('INVITED', 'ACTIVE', 'DISABLED')),
    
    CONSTRAINT chk_active_user_password
        CHECK(status <> 'ACTIVE' OR password_hash IS NOT NULL)
);