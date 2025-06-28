-- Enhance workout_results table with comprehensive metrics
-- Add category-specific and general wellness metrics

-- Add general workout metrics
ALTER TABLE workout_results ADD COLUMN completion_time_seconds INT; -- Total time to complete workout
ALTER TABLE workout_results ADD COLUMN difficulty_rating INT CHECK (difficulty_rating BETWEEN 1 AND 10); -- How difficult felt (1-10)
ALTER TABLE workout_results ADD COLUMN energy_level_before INT CHECK (energy_level_before BETWEEN 1 AND 10); -- Energy before workout
ALTER TABLE workout_results ADD COLUMN energy_level_after INT CHECK (energy_level_after BETWEEN 1 AND 10); -- Energy after workout
ALTER TABLE workout_results ADD COLUMN workout_rating INT CHECK (workout_rating BETWEEN 1 AND 5); -- Overall workout rating (1-5 stars)
ALTER TABLE workout_results ADD COLUMN rpe_rating INT CHECK (rpe_rating BETWEEN 6 AND 20); -- Rate of Perceived Exertion (6-20 scale)
ALTER TABLE workout_results ADD COLUMN mood_before VARCHAR(50); -- Mood before workout
ALTER TABLE workout_results ADD COLUMN mood_after VARCHAR(50); -- Mood after workout
ALTER TABLE workout_results ADD COLUMN notes TEXT; -- Additional notes

-- Category-specific metrics (stored as JSONB for flexibility)
ALTER TABLE workout_results ADD COLUMN category_metrics JSONB;

-- Weight training specific metrics
-- Example structure for weight training:
-- {
--   "total_volume_kg": 2500,
--   "max_weight_lifted": 100,
--   "exercises_completed": 8,
--   "sets_completed": 24,
--   "average_rest_time": 90
-- }

-- Running specific metrics
-- Example structure for running:
-- {
--   "total_distance_meters": 5000,
--   "average_pace_per_km": "4:30",
--   "max_speed_kmh": 15.5,
--   "elevation_gain_meters": 200,
--   "cadence_spm": 180
-- }

-- Swimming specific metrics
-- Example structure for swimming:
-- {
--   "total_distance_meters": 2000,
--   "stroke_type": "freestyle",
--   "pool_length_meters": 50,
--   "average_pace_per_100m": "1:45",
--   "stroke_count": 1200,
--   "swolf_score": 35
-- }

-- CrossFit specific metrics
-- Example structure for CrossFit:
-- {
--   "rounds_completed": 15,
--   "reps_completed": 450,
--   "prescribed_weight": true,
--   "scaled_movements": ["pull-ups"],
--   "workout_type": "AMRAP"
-- }

-- Hyrox specific metrics
-- Example structure for Hyrox:
-- {
--   "stations_completed": 8,
--   "total_running_time": 1800,
--   "station_times": [180, 240, 300, 200, 280, 220, 190, 160],
--   "transition_times": [30, 25, 35, 20, 40, 30, 25],
--   "equipment_weights": {"sled_push": 102, "farmers_carry": 40}
-- }

-- Stretching specific metrics
-- Example structure for stretching:
-- {
--   "total_stretches": 12,
--   "hold_times": [30, 45, 60, 30],
--   "body_areas": ["hamstrings", "shoulders", "hips"],
--   "flexibility_improvement": 3,
--   "relaxation_level": 8
-- }

-- Add performance tracking fields
ALTER TABLE workout_results ADD COLUMN is_personal_record BOOLEAN DEFAULT false;
ALTER TABLE workout_results ADD COLUMN previous_best_result TEXT; -- Reference to compare against
ALTER TABLE workout_results ADD COLUMN improvement_percentage DECIMAL(5,2); -- % improvement from last time

-- Add external integration fields
ALTER TABLE workout_results ADD COLUMN external_workout_id VARCHAR(100); -- For fitness app integrations
ALTER TABLE workout_results ADD COLUMN sync_source VARCHAR(50); -- garmin, strava, apple_health, etc.
ALTER TABLE workout_results ADD COLUMN weather_conditions VARCHAR(100); -- For outdoor workouts
ALTER TABLE workout_results ADD COLUMN location_name VARCHAR(200); -- Gym name, park, etc.

-- Rename existing 'result' column to be more descriptive
ALTER TABLE workout_results RENAME COLUMN result TO result_summary;

-- Create table for individual exercise results within a workout
CREATE TABLE exercise_results (
    id SERIAL PRIMARY KEY,
    workout_result_id INT NOT NULL REFERENCES workout_results(id) ON DELETE CASCADE,
    exercise_id INT NOT NULL REFERENCES exercises(id),
    order_completed INT NOT NULL,
    sets_completed INT,
    reps_completed INT,
    weight_used_kg DECIMAL(5,2),
    distance_completed_meters INT,
    time_taken_seconds INT,
    rest_time_seconds INT,
    notes TEXT,
    is_personal_record BOOLEAN DEFAULT false,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create table for set-by-set tracking (for detailed weight training)
CREATE TABLE set_results (
    id SERIAL PRIMARY KEY,
    exercise_result_id INT NOT NULL REFERENCES exercise_results(id) ON DELETE CASCADE,
    set_number INT NOT NULL,
    reps_completed INT,
    weight_used_kg DECIMAL(5,2),
    rpe_rating INT CHECK (rpe_rating BETWEEN 1 AND 10),
    rest_time_seconds INT,
    notes TEXT,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create workout achievements table
CREATE TABLE workout_achievements (
    id SERIAL PRIMARY KEY,
    member_id INT NOT NULL REFERENCES members(id),
    achievement_type VARCHAR(100) NOT NULL, -- 'first_workout', 'streak_milestone', 'pr_milestone', etc.
    achievement_name VARCHAR(200) NOT NULL,
    achievement_description TEXT,
    category_id INT REFERENCES workout_categories(id),
    earned_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    workout_result_id INT REFERENCES workout_results(id) -- Optional reference to triggering workout
);

-- Insert initial achievement types
INSERT INTO workout_achievements (member_id, achievement_type, achievement_name, achievement_description)
SELECT DISTINCT created_by_id, 'first_workout', 'Welcome to FitBuddy!', 'Completed your first workout on the platform'
FROM workout_results 
WHERE created_by_id NOT IN (
    SELECT DISTINCT member_id FROM workout_achievements WHERE achievement_type = 'first_workout'
);

-- Create indexes for performance
CREATE INDEX idx_workout_results_category_metrics ON workout_results USING GIN(category_metrics);
CREATE INDEX idx_workout_results_completion_time ON workout_results(completion_time_seconds);
CREATE INDEX idx_workout_results_workout_rating ON workout_results(workout_rating);
CREATE INDEX idx_workout_results_is_pr ON workout_results(is_personal_record);
CREATE INDEX idx_exercise_results_workout_result ON exercise_results(workout_result_id);
CREATE INDEX idx_exercise_results_exercise ON exercise_results(exercise_id);
CREATE INDEX idx_set_results_exercise_result ON set_results(exercise_result_id);
CREATE INDEX idx_workout_achievements_member ON workout_achievements(member_id);
CREATE INDEX idx_workout_achievements_type ON workout_achievements(achievement_type);
CREATE INDEX idx_workout_achievements_category ON workout_achievements(category_id);

-- Add comments for documentation
COMMENT ON COLUMN workout_results.completion_time_seconds IS 'Total time taken to complete the workout in seconds';
COMMENT ON COLUMN workout_results.difficulty_rating IS 'Subjective difficulty rating from 1 (very easy) to 10 (extremely hard)';
COMMENT ON COLUMN workout_results.rpe_rating IS 'Rate of Perceived Exertion using the 6-20 Borg scale';
COMMENT ON COLUMN workout_results.category_metrics IS 'JSON object containing category-specific performance metrics';
COMMENT ON COLUMN workout_results.is_personal_record IS 'Whether this result represents a personal record for the user';
COMMENT ON TABLE exercise_results IS 'Individual exercise performance within a workout session';
COMMENT ON TABLE set_results IS 'Set-by-set tracking for detailed exercise analysis';
COMMENT ON TABLE workout_achievements IS 'Gamification achievements earned by members';