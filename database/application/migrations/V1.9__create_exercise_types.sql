
CREATE TABLE exercise_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO exercise_types (name) VALUES
    ('Squat'),
    ('Squat Snatch'),
    ('Squat Clean'),
    ('Deadlift');