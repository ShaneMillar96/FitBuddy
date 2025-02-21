CREATE TABLE MEMBERS (
    id SERIAL CONSTRAINT members_id PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_date TIMESTAMP
);

CREATE TABLE WORKOUT_TYPES (
    id SERIAL CONSTRAINT workout_types_id PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE WORKOUTS (
    id SERIAL CONSTRAINT workouts_id PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    workout_type_id INT NOT NULL,
    created_by INT NOT NULL,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_date TIMESTAMP,
    FOREIGN KEY (workout_type_id) REFERENCES WORKOUT_TYPES(id),
    FOREIGN KEY (created_by) REFERENCES MEMBERS(id)
);

CREATE TABLE WORKOUT_RESULTS (
    id SERIAL CONSTRAINT workout_results_id PRIMARY KEY,
    workout_id INT NOT NULL,
    created_by INT NOT NULL,
    result TEXT,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_date TIMESTAMP,
    FOREIGN KEY (workout_id) REFERENCES WORKOUTS(id),
    FOREIGN KEY (created_by) REFERENCES MEMBERS(id)
);

CREATE TABLE COMMENTS (
    id SERIAL CONSTRAINT comments_id PRIMARY KEY,
    workout_id INT NOT NULL,
    created_by INT NOT NULL,
    comment TEXT,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_date TIMESTAMP,
    FOREIGN KEY (workout_id) REFERENCES WORKOUTS(id),
    FOREIGN KEY (created_by) REFERENCES MEMBERS(id)
)




