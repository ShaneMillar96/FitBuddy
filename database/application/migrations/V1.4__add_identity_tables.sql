CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(256),
    normalized_name VARCHAR(256),
    concurrency_stamp VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS user_roles (
    user_id INT NOT NULL,
    role_id INT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES members(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_claims (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    claim_type TEXT,
    claim_value TEXT,
    FOREIGN KEY (user_id) REFERENCES members(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_logins (
    login_provider VARCHAR(128) NOT NULL,
    provider_key VARCHAR(128) NOT NULL,
    provider_display_name VARCHAR(256),
    user_id INT NOT NULL,
    PRIMARY KEY (login_provider, provider_key),
    FOREIGN KEY (user_id) REFERENCES members(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_tokens (
    user_id INT NOT NULL,
    login_provider VARCHAR(128) NOT NULL,
    name VARCHAR(128) NOT NULL,
    value TEXT,
    PRIMARY KEY (user_id, login_provider, name),
    FOREIGN KEY (user_id) REFERENCES members(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS role_claims (
    id SERIAL PRIMARY KEY,
    role_id INT NOT NULL,
    claim_type TEXT,
    claim_value TEXT,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);
