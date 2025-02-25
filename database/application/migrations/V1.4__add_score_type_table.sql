CREATE TABLE score_types (
     id SERIAL PRIMARY KEY,
     name VARCHAR(50) NOT NULL
);

INSERT INTO score_types (id, name) VALUES
    (1, 'Time' ), 
    (2, 'Reps');  

ALTER TABLE workouts ADD COLUMN score_type_id INT REFERENCES score_types(id);

UPDATE workouts SET score_type_id = 1 WHERE workout_type_id IN (3, 5); 
UPDATE workouts SET score_type_id = 2 WHERE workout_type_id IN (1, 2, 4);
