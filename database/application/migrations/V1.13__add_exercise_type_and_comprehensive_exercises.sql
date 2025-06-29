-- Add exercise_type column to exercises table
ALTER TABLE exercises ADD COLUMN exercise_type VARCHAR(20) DEFAULT 'strength';

-- Update existing exercises with appropriate types
UPDATE exercises SET exercise_type = 'bodyweight' WHERE name IN ('Box Jumps', 'Burpee Broad Jumps', 'Wall Balls');
UPDATE exercises SET exercise_type = 'cardio' WHERE name IN ('Ski Erg', 'Rowing');
UPDATE exercises SET exercise_type = 'distance_based' WHERE name IN ('400m Intervals', 'Hill Sprints', 'Tempo Run', 'Fartlek Intervals');
UPDATE exercises SET exercise_type = 'strength' WHERE name IN ('Sled Push', 'Sled Pull', 'Farmers Carry', 'Sandbag Lunges', 'Barbell Back Squat');

-- Delete inappropriate existing exercises that don't fit categories
DELETE FROM exercises WHERE name IN ('Bench Press', 'Pull-ups') AND category_id = 5; -- Remove from Hyrox

-- Add comprehensive Weight Session exercises
INSERT INTO exercises (name, category_id, muscle_groups, equipment_needed, description, instructions, difficulty_level, is_compound, exercise_type, created_date) VALUES

-- Weight Session - Push (Chest, Shoulders, Triceps)
('Barbell Bench Press', 1, ARRAY['chest', 'triceps', 'shoulders'], ARRAY['barbell', 'bench', 'plates'], 'Compound pushing movement for chest development', 'Lie on bench, grip bar wider than shoulders, lower to chest, press up', 2, true, 'strength', NOW()),
('Incline Dumbbell Press', 1, ARRAY['chest', 'triceps', 'shoulders'], ARRAY['dumbbells', 'incline bench'], 'Upper chest focused pressing movement', 'Set bench to 30-45 degrees, press dumbbells from chest level', 2, true, 'strength', NOW()),
('Overhead Press', 1, ARRAY['shoulders', 'triceps', 'core'], ARRAY['barbell', 'plates'], 'Standing shoulder press for overhead strength', 'Stand tall, press bar from shoulders to overhead, control descent', 3, true, 'strength', NOW()),
('Dumbbell Shoulder Press', 1, ARRAY['shoulders', 'triceps'], ARRAY['dumbbells'], 'Seated or standing shoulder press', 'Press dumbbells from shoulder level to overhead', 2, false, 'strength', NOW()),
('Dips', 1, ARRAY['triceps', 'chest', 'shoulders'], ARRAY['dip bars'], 'Bodyweight pushing exercise', 'Lower body between bars, press back to start', 3, true, 'bodyweight', NOW()),
('Close-Grip Bench Press', 1, ARRAY['triceps', 'chest'], ARRAY['barbell', 'bench', 'plates'], 'Tricep-focused bench press variation', 'Narrow grip bench press, elbows close to body', 2, true, 'strength', NOW()),
('Tricep Dips', 1, ARRAY['triceps'], ARRAY['bench'], 'Tricep isolation using bench', 'Hands on bench, lower body, press back up', 1, false, 'bodyweight', NOW()),
('Push-ups', 1, ARRAY['chest', 'triceps', 'shoulders'], ARRAY['none'], 'Basic bodyweight pushing exercise', 'Plank position, lower chest to ground, push back up', 1, true, 'bodyweight', NOW()),

-- Weight Session - Pull (Back, Biceps)
('Deadlift', 1, ARRAY['hamstrings', 'glutes', 'back', 'traps'], ARRAY['barbell', 'plates'], 'King of compound movements', 'Hip hinge movement, pull bar from floor to standing', 4, true, 'strength', NOW()),
('Pull-ups', 1, ARRAY['lats', 'rhomboids', 'biceps'], ARRAY['pull-up bar'], 'Bodyweight vertical pulling', 'Hang from bar, pull chin over bar, control descent', 3, true, 'bodyweight', NOW()),
('Bent-Over Barbell Row', 1, ARRAY['lats', 'rhomboids', 'rear delts'], ARRAY['barbell', 'plates'], 'Horizontal pulling movement', 'Hinge at hips, row bar to lower chest', 3, true, 'strength', NOW()),
('Lat Pulldown', 1, ARRAY['lats', 'rhomboids', 'biceps'], ARRAY['cable machine'], 'Vertical pulling machine exercise', 'Pull bar to upper chest, control return', 2, true, 'strength', NOW()),
('Seated Cable Row', 1, ARRAY['lats', 'rhomboids', 'rear delts'], ARRAY['cable machine'], 'Horizontal pulling movement', 'Pull handle to lower chest, squeeze shoulder blades', 2, true, 'strength', NOW()),
('T-Bar Row', 1, ARRAY['lats', 'rhomboids', 'rear delts'], ARRAY['t-bar', 'plates'], 'Landmine rowing variation', 'Hinge at hips, row bar to chest', 2, true, 'strength', NOW()),
('Barbell Bicep Curl', 1, ARRAY['biceps'], ARRAY['barbell', 'plates'], 'Primary bicep isolation exercise', 'Curl bar from extended arms to chest level', 1, false, 'strength', NOW()),
('Dumbbell Bicep Curl', 1, ARRAY['biceps'], ARRAY['dumbbells'], 'Unilateral bicep development', 'Curl dumbbells alternating or together', 1, false, 'strength', NOW()),
('Hammer Curl', 1, ARRAY['biceps', 'forearms'], ARRAY['dumbbells'], 'Neutral grip bicep curl', 'Curl with neutral grip, targets brachialis', 1, false, 'strength', NOW()),
('Chin-ups', 1, ARRAY['lats', 'biceps'], ARRAY['pull-up bar'], 'Underhand grip pull-up', 'Underhand grip, pull chin over bar', 3, true, 'bodyweight', NOW()),

-- Weight Session - Legs
('Back Squat', 1, ARRAY['quadriceps', 'glutes', 'hamstrings'], ARRAY['barbell', 'squat rack', 'plates'], 'King of leg exercises', 'Bar on back, squat down to parallel, drive up', 3, true, 'strength', NOW()),
('Front Squat', 1, ARRAY['quadriceps', 'core', 'glutes'], ARRAY['barbell', 'squat rack', 'plates'], 'Quad-dominant squat variation', 'Bar on front shoulders, squat maintaining upright torso', 4, true, 'strength', NOW()),
('Romanian Deadlift', 1, ARRAY['hamstrings', 'glutes', 'back'], ARRAY['barbell', 'plates'], 'Hip hinge movement for hamstrings', 'Keep legs straight, hinge at hips, feel hamstring stretch', 2, true, 'strength', NOW()),
('Leg Press', 1, ARRAY['quadriceps', 'glutes'], ARRAY['leg press machine'], 'Machine-based leg exercise', 'Press weight with legs from seated position', 1, true, 'strength', NOW()),
('Leg Curl', 1, ARRAY['hamstrings'], ARRAY['leg curl machine'], 'Hamstring isolation exercise', 'Curl heels to glutes against resistance', 1, false, 'strength', NOW()),
('Leg Extension', 1, ARRAY['quadriceps'], ARRAY['leg extension machine'], 'Quadricep isolation exercise', 'Extend legs against resistance from seated position', 1, false, 'strength', NOW()),
('Bulgarian Split Squat', 1, ARRAY['quadriceps', 'glutes'], ARRAY['dumbbells', 'bench'], 'Single-leg squat variation', 'Rear foot elevated, squat down on front leg', 3, true, 'strength', NOW()),
('Walking Lunges', 1, ARRAY['quadriceps', 'glutes'], ARRAY['dumbbells'], 'Dynamic single-leg exercise', 'Step forward into lunge, alternate legs walking', 2, true, 'strength', NOW()),
('Calf Raise', 1, ARRAY['calves'], ARRAY['dumbbells'], 'Calf isolation exercise', 'Rise up on toes, control descent', 1, false, 'strength', NOW()),
('Hip Thrust', 1, ARRAY['glutes', 'hamstrings'], ARRAY['barbell', 'bench', 'plates'], 'Glute-focused hip extension', 'Back on bench, thrust hips up with barbell', 2, true, 'strength', NOW()),

-- Hyrox specific exercises
('1km Run', 5, ARRAY['cardiovascular', 'legs'], ARRAY['none'], 'Standard Hyrox running segment', 'Maintain steady pace for 1km distance', 2, false, 'distance_based', NOW()),
('Rowing 1000m', 5, ARRAY['cardiovascular', 'back', 'legs'], ARRAY['rowing machine'], 'Hyrox Station 1', 'Row 1000m maintaining consistent stroke rate', 3, true, 'cardio', NOW()),
('Ski Erg 1000m', 5, ARRAY['cardiovascular', 'core', 'lats'], ARRAY['ski erg'], 'Hyrox Station 2', 'Ski for 1000m using full body motion', 3, true, 'cardio', NOW()),
('Sled Push 50m', 5, ARRAY['legs', 'core'], ARRAY['sled', 'plates'], 'Hyrox Station 3', 'Push weighted sled 50m maintaining low position', 4, true, 'strength', NOW()),
('Burpee Broad Jump 80m', 5, ARRAY['full body', 'cardiovascular'], ARRAY['none'], 'Hyrox Station 4', 'Perform burpee then broad jump, repeat for 80m', 4, true, 'bodyweight', NOW()),
('Rowing 1000m', 5, ARRAY['cardiovascular', 'back', 'legs'], ARRAY['rowing machine'], 'Hyrox Station 5', 'Second rowing station', 3, true, 'cardio', NOW()),
('Farmers Carry 200m', 5, ARRAY['grip', 'traps', 'core'], ARRAY['kettlebells'], 'Hyrox Station 6', 'Carry heavy weights 200m maintaining posture', 3, true, 'strength', NOW()),
('Sandbag Lunges 100m', 5, ARRAY['legs', 'core'], ARRAY['sandbag'], 'Hyrox Station 7', 'Lunge 100m carrying sandbag', 4, true, 'strength', NOW()),
('Wall Balls 100 reps', 5, ARRAY['legs', 'shoulders', 'core'], ARRAY['medicine ball', 'wall'], 'Hyrox Station 8', 'Squat and throw ball to target 100 times', 4, true, 'strength', NOW()),
('Sled Pull 50m', 5, ARRAY['back', 'legs'], ARRAY['sled', 'rope'], 'Sled pulling variation', 'Pull weighted sled 50m using rope', 3, true, 'strength', NOW()),

-- Running Intervals
('100m Sprint', 3, ARRAY['legs', 'cardiovascular'], ARRAY['track'], 'Short distance sprint', 'Maximum effort 100m sprint', 2, false, 'distance_based', NOW()),
('200m Sprint', 3, ARRAY['legs', 'cardiovascular'], ARRAY['track'], 'Speed endurance sprint', 'Fast 200m maintaining speed', 3, false, 'distance_based', NOW()),
('400m Repeat', 3, ARRAY['legs', 'cardiovascular'], ARRAY['track'], 'One lap interval', 'Fast 400m with rest between repeats', 3, false, 'distance_based', NOW()),
('800m Interval', 3, ARRAY['legs', 'cardiovascular'], ARRAY['track'], 'Middle distance interval', '800m at threshold pace', 4, false, 'distance_based', NOW()),
('1500m Repeat', 3, ARRAY['legs', 'cardiovascular'], ARRAY['track'], 'Longer interval training', '1500m at comfortably hard pace', 4, false, 'distance_based', NOW()),
('5km Time Trial', 3, ARRAY['legs', 'cardiovascular'], ARRAY['track'], '5km race pace effort', 'Sustained effort for 5km', 4, false, 'distance_based', NOW()),
('10km Tempo', 3, ARRAY['legs', 'cardiovascular'], ARRAY['road'], 'Tempo pace 10km', 'Comfortably hard effort for 10km', 5, false, 'distance_based', NOW()),
('Hill Repeats', 3, ARRAY['legs', 'cardiovascular'], ARRAY['hill'], 'Uphill running intervals', 'Hard effort uphill, easy recovery down', 4, false, 'distance_based', NOW()),
('Fartlek 30 minutes', 3, ARRAY['legs', 'cardiovascular'], ARRAY['none'], 'Unstructured speed play', 'Vary pace throughout 30min run', 3, false, 'time_based', NOW()),

-- CrossFit WOD exercises
('Thrusters', 2, ARRAY['legs', 'shoulders', 'core'], ARRAY['barbell', 'plates'], 'Squat to overhead press', 'Front squat then press overhead in one motion', 4, true, 'strength', NOW()),
('Clean and Jerk', 2, ARRAY['full body'], ARRAY['barbell', 'plates'], 'Olympic lift', 'Pull bar to shoulders, then jerk overhead', 5, true, 'strength', NOW()),
('Snatch', 2, ARRAY['full body'], ARRAY['barbell', 'plates'], 'Olympic lift', 'Pull bar from floor to overhead in one motion', 5, true, 'strength', NOW()),
('Kettlebell Swing', 2, ARRAY['glutes', 'hamstrings', 'core'], ARRAY['kettlebell'], 'Hip hinge power movement', 'Swing kettlebell to eye level using hip drive', 2, true, 'strength', NOW()),
('Double Unders', 2, ARRAY['calves', 'cardiovascular'], ARRAY['jump rope'], 'Advanced jump rope', 'Two rope passes per jump', 3, false, 'cardio', NOW()),
('Muscle-ups', 2, ARRAY['lats', 'triceps', 'core'], ARRAY['pull-up bar'], 'Advanced gymnastic movement', 'Transition from pull-up to dip above bar', 5, true, 'bodyweight', NOW()),
('Handstand Push-ups', 2, ARRAY['shoulders', 'triceps', 'core'], ARRAY['wall'], 'Inverted push-up', 'Push-up in handstand position against wall', 4, true, 'bodyweight', NOW()),
('Toes-to-Bar', 2, ARRAY['core', 'lats'], ARRAY['pull-up bar'], 'Hanging core exercise', 'Hang from bar, bring toes to touch bar', 4, false, 'bodyweight', NOW()),

-- Swimming exercises
('Freestyle 50m', 4, ARRAY['full body', 'cardiovascular'], ARRAY['pool'], 'Front crawl swimming', 'Standard freestyle stroke for 50m', 2, false, 'distance_based', NOW()),
('Freestyle 100m', 4, ARRAY['full body', 'cardiovascular'], ARRAY['pool'], 'Front crawl swimming', 'Standard freestyle stroke for 100m', 3, false, 'distance_based', NOW()),
('Backstroke 50m', 4, ARRAY['back', 'shoulders', 'cardiovascular'], ARRAY['pool'], 'Swimming on back', 'Backstroke technique for 50m', 2, false, 'distance_based', NOW()),
('Breaststroke 50m', 4, ARRAY['chest', 'legs', 'cardiovascular'], ARRAY['pool'], 'Frog-like swimming stroke', 'Breaststroke technique for 50m', 3, false, 'distance_based', NOW()),
('Butterfly 25m', 4, ARRAY['core', 'shoulders', 'cardiovascular'], ARRAY['pool'], 'Advanced swimming stroke', 'Butterfly stroke for 25m', 4, false, 'distance_based', NOW()),
('Individual Medley 100m', 4, ARRAY['full body', 'cardiovascular'], ARRAY['pool'], 'All four strokes', '25m each stroke: butterfly, backstroke, breaststroke, freestyle', 4, false, 'distance_based', NOW()),

-- Stretching/Mobility
('Dynamic Warm-up', 6, ARRAY['full body'], ARRAY['none'], 'Movement preparation', 'Dynamic movements to prepare for exercise', 1, false, 'time_based', NOW()),
('Static Hip Flexor Stretch', 6, ARRAY['hip flexors'], ARRAY['none'], 'Hip flexor mobility', 'Hold stretch for hip flexor muscles', 1, false, 'time_based', NOW()),
('Hamstring Stretch', 6, ARRAY['hamstrings'], ARRAY['none'], 'Hamstring flexibility', 'Hold stretch for hamstring muscles', 1, false, 'time_based', NOW()),
('Shoulder Stretch', 6, ARRAY['shoulders'], ARRAY['none'], 'Shoulder mobility', 'Hold stretch for shoulder muscles', 1, false, 'time_based', NOW()),
('Yoga Flow 20 minutes', 6, ARRAY['full body'], ARRAY['yoga mat'], 'Flowing yoga sequence', 'Continuous yoga movements for flexibility', 2, false, 'time_based', NOW()),
('Foam Rolling', 6, ARRAY['full body'], ARRAY['foam roller'], 'Self-myofascial release', 'Roll muscles to release tension', 1, false, 'time_based', NOW()),
('Pigeon Pose', 6, ARRAY['hips', 'glutes'], ARRAY['yoga mat'], 'Hip opener stretch', 'Deep hip flexor and glute stretch', 2, false, 'time_based', NOW());

-- Update exercise categories to ensure proper mapping
UPDATE exercises SET category_id = 1 WHERE name LIKE '%Bench Press%' OR name LIKE '%Squat%' OR name LIKE '%Deadlift%' OR name LIKE '%Press%' OR name LIKE '%Row%' OR name LIKE '%Curl%';
UPDATE exercises SET category_id = 2 WHERE name IN ('Thrusters', 'Clean and Jerk', 'Snatch', 'Kettlebell Swing', 'Double Unders', 'Muscle-ups', 'Handstand Push-ups', 'Toes-to-Bar');
UPDATE exercises SET category_id = 3 WHERE name LIKE '%Sprint%' OR name LIKE '%Interval%' OR name LIKE '%Run%' OR name LIKE '%Tempo%' OR name LIKE '%Hill%' OR name LIKE '%Fartlek%';
UPDATE exercises SET category_id = 4 WHERE name LIKE '%Freestyle%' OR name LIKE '%Backstroke%' OR name LIKE '%Breaststroke%' OR name LIKE '%Butterfly%' OR name LIKE '%Medley%';
UPDATE exercises SET category_id = 5 WHERE name LIKE '%Hyrox%' OR name LIKE '%1km%' OR name LIKE '%Rowing%' OR name LIKE '%Sled%' OR name LIKE '%Burpee Broad%' OR name LIKE '%Wall Ball%';
UPDATE exercises SET category_id = 6 WHERE name LIKE '%Stretch%' OR name LIKE '%Yoga%' OR name LIKE '%Foam%' OR name LIKE '%Pose%' OR name LIKE '%Warm%';