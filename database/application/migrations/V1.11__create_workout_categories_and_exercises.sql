-- Create workout categories table to replace simple workout types
CREATE TABLE workout_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50),
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert the main workout categories
INSERT INTO workout_categories (id, name, description, icon) VALUES
    (1, 'Weight Session', 'Traditional bodybuilding and strength training workouts', 'dumbbell'),
    (2, 'CrossFit WOD', 'High-intensity functional fitness workouts', 'crossfit'),
    (3, 'Running Intervals', 'Running-based cardio and interval training', 'running'),
    (4, 'Swimming', 'Pool and open water swimming workouts', 'swimming'),
    (5, 'Hyrox', 'Hybrid fitness race training combining running and functional movements', 'hyrox'),
    (6, 'Stretching', 'Flexibility, mobility, and recovery sessions', 'stretching');

-- Create workout sub-types for more granular categorization
CREATE TABLE workout_sub_types (
    id SERIAL PRIMARY KEY,
    category_id INT NOT NULL REFERENCES workout_categories(id),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sub-types for each category
INSERT INTO workout_sub_types (category_id, name, description) VALUES
    -- Weight Session sub-types
    (1, 'Push', 'Chest, shoulders, and triceps focused workout'),
    (1, 'Pull', 'Back and biceps focused workout'),
    (1, 'Legs', 'Lower body focused workout'),
    (1, 'Upper Body', 'General upper body workout'),
    (1, 'Full Body', 'Complete body workout'),
    (1, 'Powerlifting', 'Competition-style powerlifting workout'),
    
    -- CrossFit WOD sub-types
    (2, 'EMOM', 'Every Minute on the Minute'),
    (2, 'AMRAP', 'As Many Rounds As Possible'),
    (2, 'For Time', 'Complete the workout as fast as possible'),
    (2, 'Tabata', '4-minute high-intensity interval protocol'),
    (2, 'Ladder', 'Increasing or decreasing rep scheme'),
    (2, 'Chipper', 'Long workout with many movements'),
    
    -- Running Intervals sub-types
    (3, 'Track Intervals', 'Structured track-based interval training'),
    (3, 'Tempo Run', 'Sustained moderate-high intensity run'),
    (3, 'Fartlek', 'Unstructured speed play running'),
    (3, 'Hill Repeats', 'Uphill interval training'),
    (3, 'Long Run', 'Extended duration aerobic run'),
    (3, 'Recovery Run', 'Easy-paced recovery session'),
    
    -- Swimming sub-types
    (4, 'Freestyle', 'Front crawl focused session'),
    (4, 'Backstroke', 'Backstroke technique and training'),
    (4, 'Breaststroke', 'Breaststroke focused workout'),
    (4, 'Butterfly', 'Butterfly stroke training'),
    (4, 'Individual Medley', 'All four strokes combined'),
    (4, 'Open Water', 'Open water swimming training'),
    
    -- Hyrox sub-types
    (5, 'Full Simulation', 'Complete 8-station Hyrox race simulation'),
    (5, 'Strength Stations', 'Focus on functional strength movements'),
    (5, 'Running Focus', 'Emphasis on running segments'),
    (5, 'Station Practice', 'Individual station skill development'),
    (5, 'Transition Training', 'Practice moving between stations'),
    
    -- Stretching sub-types
    (6, 'Dynamic Warm-up', 'Movement-based preparation'),
    (6, 'Static Stretching', 'Hold-based flexibility work'),
    (6, 'Yoga Flow', 'Yoga-inspired stretching sequence'),
    (6, 'Foam Rolling', 'Self-myofascial release session'),
    (6, 'Mobility Work', 'Joint mobility and movement prep'),
    (6, 'Cool Down', 'Post-workout recovery stretching');

-- Create exercises master table
CREATE TABLE exercises (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    category_id INT NOT NULL REFERENCES workout_categories(id),
    muscle_groups TEXT[], -- Array of muscle groups
    equipment_needed TEXT[], -- Array of equipment
    description TEXT,
    instructions TEXT,
    difficulty_level INT CHECK (difficulty_level BETWEEN 1 AND 5),
    is_compound BOOLEAN DEFAULT false,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample exercises for each category
INSERT INTO exercises (name, category_id, muscle_groups, equipment_needed, description, difficulty_level, is_compound) VALUES
    -- Weight Session exercises
    ('Barbell Back Squat', 1, ARRAY['quadriceps', 'glutes', 'hamstrings', 'core'], ARRAY['barbell', 'squat rack'], 'Fundamental compound lower body movement', 3, true),
    ('Deadlift', 1, ARRAY['hamstrings', 'glutes', 'back', 'traps', 'core'], ARRAY['barbell', 'plates'], 'Hip hinge movement pattern', 4, true),
    ('Bench Press', 1, ARRAY['chest', 'shoulders', 'triceps'], ARRAY['barbell', 'bench'], 'Horizontal pushing movement', 3, true),
    ('Pull-ups', 1, ARRAY['lats', 'rhomboids', 'biceps'], ARRAY['pull-up bar'], 'Vertical pulling movement', 4, true),
    ('Overhead Press', 1, ARRAY['shoulders', 'triceps', 'core'], ARRAY['barbell'], 'Vertical pressing movement', 3, true),
    
    -- CrossFit WOD exercises
    ('Burpees', 2, ARRAY['full body'], ARRAY['none'], 'Full body explosive movement', 2, true),
    ('Box Jumps', 2, ARRAY['quadriceps', 'glutes', 'calves'], ARRAY['plyo box'], 'Explosive lower body movement', 2, false),
    ('Kettlebell Swings', 2, ARRAY['glutes', 'hamstrings', 'core'], ARRAY['kettlebell'], 'Hip hinge explosive movement', 2, true),
    ('Wall Balls', 2, ARRAY['quadriceps', 'shoulders', 'core'], ARRAY['medicine ball', 'wall'], 'Squat to overhead throw', 2, true),
    ('Double Unders', 2, ARRAY['calves', 'shoulders', 'core'], ARRAY['jump rope'], 'Advanced rope jumping', 3, false),
    
    -- Running exercises
    ('400m Intervals', 3, ARRAY['legs', 'cardiovascular'], ARRAY['track'], 'Track-based speed intervals', 2, false),
    ('Hill Sprints', 3, ARRAY['legs', 'glutes', 'cardiovascular'], ARRAY['hill'], 'Uphill sprint intervals', 3, false),
    ('Tempo Run', 3, ARRAY['legs', 'cardiovascular'], ARRAY['none'], 'Sustained effort run', 2, false),
    ('Fartlek Intervals', 3, ARRAY['legs', 'cardiovascular'], ARRAY['none'], 'Unstructured speed play', 2, false),
    
    -- Swimming exercises
    ('Freestyle Laps', 4, ARRAY['lats', 'shoulders', 'core', 'legs'], ARRAY['pool'], 'Front crawl swimming', 2, true),
    ('Backstroke Laps', 4, ARRAY['lats', 'shoulders', 'core'], ARRAY['pool'], 'Backstroke swimming', 2, true),
    ('Breaststroke Laps', 4, ARRAY['chest', 'legs', 'core'], ARRAY['pool'], 'Breaststroke swimming', 3, true),
    ('Swimming Drill Sets', 4, ARRAY['technique'], ARRAY['pool'], 'Technique-focused drills', 2, false),
    
    -- Hyrox exercises
    ('Ski Erg', 5, ARRAY['lats', 'core', 'legs'], ARRAY['ski erg'], 'Upper body cardio machine', 2, true),
    ('Sled Push', 5, ARRAY['quadriceps', 'glutes', 'core'], ARRAY['sled'], 'Horizontal pushing movement', 3, true),
    ('Sled Pull', 5, ARRAY['lats', 'rhomboids', 'legs'], ARRAY['sled'], 'Horizontal pulling movement', 3, true),
    ('Farmers Carry', 5, ARRAY['traps', 'forearms', 'core'], ARRAY['kettlebells'], 'Loaded carry movement', 2, true),
    ('Sandbag Lunges', 5, ARRAY['quadriceps', 'glutes', 'core'], ARRAY['sandbag'], 'Unilateral leg movement', 3, true),
    
    -- Stretching exercises
    ('Hamstring Stretch', 6, ARRAY['hamstrings'], ARRAY['none'], 'Posterior chain flexibility', 1, false),
    ('Hip Flexor Stretch', 6, ARRAY['hip flexors'], ARRAY['none'], 'Hip mobility stretch', 1, false),
    ('Shoulder Rolls', 6, ARRAY['shoulders'], ARRAY['none'], 'Shoulder mobility exercise', 1, false),
    ('Cat-Cow Stretch', 6, ARRAY['spine', 'core'], ARRAY['none'], 'Spinal mobility movement', 1, false),
    ('Pigeon Pose', 6, ARRAY['hips', 'glutes'], ARRAY['none'], 'Deep hip opener', 2, false);

-- Create workout_exercises junction table for workout composition
CREATE TABLE workout_exercises (
    id SERIAL PRIMARY KEY,
    workout_id INT NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
    exercise_id INT NOT NULL REFERENCES exercises(id),
    order_in_workout INT NOT NULL,
    sets INT,
    reps INT,
    weight_kg DECIMAL(5,2),
    distance_meters INT,
    duration_seconds INT,
    rest_seconds INT,
    notes TEXT,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add new columns to workouts table
ALTER TABLE workouts ADD COLUMN category_id INT REFERENCES workout_categories(id);
ALTER TABLE workouts ADD COLUMN sub_type_id INT REFERENCES workout_sub_types(id);
ALTER TABLE workouts ADD COLUMN difficulty_level INT CHECK (difficulty_level BETWEEN 1 AND 5);
ALTER TABLE workouts ADD COLUMN estimated_duration_minutes INT;
ALTER TABLE workouts ADD COLUMN equipment_needed TEXT[];
ALTER TABLE workouts ADD COLUMN workout_structure JSONB; -- Flexible structure storage

-- Migrate existing workouts to new category system
-- Map existing workout_types to new categories (CrossFit focus -> Category 2)
UPDATE workouts SET category_id = 2 WHERE workout_type_id IS NOT NULL;

-- Map workout_types to sub_types
UPDATE workouts SET sub_type_id = 
    CASE workout_type_id
        WHEN 1 THEN 7  -- EMOM
        WHEN 2 THEN 8  -- AMRAP  
        WHEN 3 THEN 9  -- For Time
        WHEN 4 THEN 10 -- Tabata
        WHEN 5 THEN 11 -- Ladder
        ELSE NULL
    END
WHERE workout_type_id IS NOT NULL;

-- Create indexes for performance
CREATE INDEX idx_workout_categories_name ON workout_categories(name);
CREATE INDEX idx_workout_sub_types_category ON workout_sub_types(category_id);
CREATE INDEX idx_exercises_category ON exercises(category_id);
CREATE INDEX idx_exercises_muscle_groups ON exercises USING GIN(muscle_groups);
CREATE INDEX idx_workout_exercises_workout ON workout_exercises(workout_id);
CREATE INDEX idx_workout_exercises_exercise ON workout_exercises(exercise_id);
CREATE INDEX idx_workouts_category ON workouts(category_id);
CREATE INDEX idx_workouts_sub_type ON workouts(sub_type_id);