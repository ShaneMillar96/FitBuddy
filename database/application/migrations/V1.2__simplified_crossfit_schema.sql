-- Simplified CrossFit-only database schema
-- This migration creates all the necessary tables and enhancements for a CrossFit-focused system

-- Add password_hash column to members table for authentication
ALTER TABLE members ADD COLUMN password_hash VARCHAR(255) NOT NULL DEFAULT '';

-- Rename comment column to description in comments table
ALTER TABLE comments RENAME COLUMN comment TO description;

-- Create score_types table for workout scoring methods
CREATE TABLE score_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert score types for CrossFit workouts
INSERT INTO score_types (name, description) VALUES
    ('Time', 'Complete workout as fast as possible'),
    ('Rounds', 'Complete as many rounds as possible'),
    ('Weight', 'Lift maximum weight'),
    ('Reps', 'Complete maximum repetitions'),
    ('Distance', 'Travel maximum distance'),
    ('Calories', 'Burn maximum calories');

-- Add CrossFit-specific columns to workouts table
ALTER TABLE workouts ADD COLUMN score_type_id INT REFERENCES score_types(id);
ALTER TABLE workouts ADD COLUMN difficulty_level INT CHECK (difficulty_level BETWEEN 1 AND 5);
ALTER TABLE workouts ADD COLUMN estimated_duration_minutes INT;

-- Create exercises table for CrossFit movements
CREATE TABLE exercises (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL UNIQUE,
    description TEXT,
    instructions TEXT,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert essential CrossFit exercises
INSERT INTO exercises (name, description, instructions) VALUES
    ('Burpees', 'Full body explosive movement', 'Drop to push-up position, jump back up, jump with arms overhead'),
    ('Thrusters', 'Squat to overhead press', 'Hold barbell at chest, squat down, drive up and press overhead'),
    ('Pull-ups', 'Upper body pulling movement', 'Hang from bar, pull body up until chin over bar'),
    ('Push-ups', 'Upper body pushing movement', 'Start in plank, lower chest to ground, push back up'),
    ('Box Jumps', 'Explosive lower body movement', 'Jump onto box with both feet, step down with control'),
    ('Kettlebell Swings', 'Hip hinge explosive movement', 'Swing kettlebell from between legs to chest height'),
    ('Wall Balls', 'Squat to overhead throw', 'Hold medicine ball, squat down, drive up and throw ball to target'),
    ('Double Unders', 'Advanced rope jumping', 'Jump rope passing under feet twice per jump'),
    ('Mountain Climbers', 'High-intensity cardio movement', 'In plank position, alternate bringing knees to chest'),
    ('Air Squats', 'Bodyweight squat movement', 'Squat down keeping chest up, return to standing'),
    ('Jumping Jacks', 'Full-body cardio exercise', 'Jump feet apart while raising arms overhead'),
    ('High Knees', 'Running in place with high knees', 'Run in place bringing knees up to chest level'),
    ('Plank', 'Core strengthening hold', 'Hold push-up position keeping body straight'),
    ('Sit-ups', 'Core strengthening exercise', 'Lie on back, sit up bringing chest to knees'),
    ('Russian Twists', 'Core rotational exercise', 'Sit with knees bent, twist torso side to side'),
    ('Deadlifts', 'Hip hinge movement', 'Lift barbell from ground using hips and legs'),
    ('Clean and Jerk', 'Olympic lifting movement', 'Lift barbell to shoulders, then overhead'),
    ('Snatch', 'Olympic lifting movement', 'Lift barbell from ground to overhead in one motion'),
    ('Muscle-ups', 'Advanced upper body movement', 'Pull-up transitioning to dip above bar/rings'),
    ('Handstand Push-ups', 'Inverted overhead press', 'In handstand position, lower and press back up'),
    ('Toes-to-Bar', 'Core and grip exercise', 'Hang from bar, bring toes to touch bar'),
    ('Rowing', 'Cardio machine exercise', 'Use rowing machine for specified distance or time'),
    ('Running', 'Cardio exercise', 'Run for specified distance or time'),
    ('Bike/Assault Bike', 'Cardio machine exercise', 'Use stationary bike for specified distance or time');

-- Create workout_exercises junction table
CREATE TABLE workout_exercises (
    id SERIAL PRIMARY KEY,
    workout_id INT NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
    exercise_id INT NOT NULL REFERENCES exercises(id),
    order_in_workout INT NOT NULL,
    sets INT,
    reps INT,
    time_seconds INT,
    rest_seconds INT,
    weight_description VARCHAR(100), -- e.g., "bodyweight", "50kg", "heavy"
    notes TEXT,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create workout_favorites table for member favorites
CREATE TABLE workout_favorites (
    id SERIAL PRIMARY KEY,
    workout_id INT NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
    member_id INT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(workout_id, member_id)
);

-- Enhance workout_results table with CrossFit-specific metrics
ALTER TABLE workout_results ADD COLUMN completion_time_seconds INT;
ALTER TABLE workout_results ADD COLUMN difficulty_rating INT CHECK (difficulty_rating BETWEEN 1 AND 5);
ALTER TABLE workout_results ADD COLUMN workout_rating INT CHECK (workout_rating BETWEEN 1 AND 5);
ALTER TABLE workout_results ADD COLUMN rpe_rating INT CHECK (rpe_rating BETWEEN 1 AND 10);
ALTER TABLE workout_results ADD COLUMN notes TEXT;
ALTER TABLE workout_results ADD COLUMN is_personal_record BOOLEAN DEFAULT FALSE;

-- Create indexes for performance
CREATE INDEX idx_workouts_score_type ON workouts(score_type_id);
CREATE INDEX idx_workouts_difficulty ON workouts(difficulty_level);
CREATE INDEX idx_workouts_duration ON workouts(estimated_duration_minutes);
CREATE INDEX idx_workout_exercises_workout ON workout_exercises(workout_id);
CREATE INDEX idx_workout_exercises_exercise ON workout_exercises(exercise_id);
CREATE INDEX idx_workout_exercises_order ON workout_exercises(workout_id, order_in_workout);
CREATE INDEX idx_workout_favorites_member ON workout_favorites(member_id);
CREATE INDEX idx_workout_favorites_workout ON workout_favorites(workout_id);
CREATE INDEX idx_workout_results_member ON workout_results(created_by_id);
CREATE INDEX idx_workout_results_workout ON workout_results(workout_id);
CREATE INDEX idx_workout_results_completion_time ON workout_results(completion_time_seconds);
CREATE INDEX idx_workout_results_is_pr ON workout_results(is_personal_record);

-- Create view for workout statistics
CREATE VIEW workout_stats AS
SELECT 
    w.id,
    w.name,
    w.workout_type_id,
    w.score_type_id,
    w.difficulty_level,
    w.estimated_duration_minutes,
    COUNT(DISTINCT wr.id) as total_completions,
    COUNT(DISTINCT wf.id) as total_favorites,
    COUNT(DISTINCT c.id) as total_comments,
    AVG(wr.difficulty_rating) as avg_difficulty_rating,
    AVG(wr.workout_rating) as avg_workout_rating,
    MIN(wr.completion_time_seconds) as best_time,
    AVG(wr.completion_time_seconds) as avg_time
FROM workouts w
LEFT JOIN workout_results wr ON w.id = wr.workout_id
LEFT JOIN workout_favorites wf ON w.id = wf.workout_id
LEFT JOIN comments c ON w.id = c.workout_id
GROUP BY w.id, w.name, w.workout_type_id, w.score_type_id, w.difficulty_level, w.estimated_duration_minutes;