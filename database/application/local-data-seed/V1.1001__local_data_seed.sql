-- Insert Members (10 members)
INSERT INTO members (username, email, password_hash, created_date) VALUES
                                                                       ('john_doe', 'john.doe@email.com', 'hashed_password_1', CURRENT_TIMESTAMP),
                                                                       ('jane_smith', 'jane.smith@email.com', 'hashed_password_2', CURRENT_TIMESTAMP),
                                                                       ('mike_jones', 'mike.jones@email.com', 'hashed_password_3', CURRENT_TIMESTAMP),
                                                                       ('sarah_lee', 'sarah.lee@email.com', 'hashed_password_4', CURRENT_TIMESTAMP),
                                                                       ('chris_brown', 'chris.brown@email.com', 'hashed_password_5', CURRENT_TIMESTAMP),
                                                                       ('emma_watson', 'emma.watson@email.com', 'hashed_password_6', CURRENT_TIMESTAMP),
                                                                       ('david_kim', 'david.kim@email.com', 'hashed_password_7', CURRENT_TIMESTAMP),
                                                                       ('lisa_nguyen', 'lisa.nguyen@email.com', 'hashed_password_8', CURRENT_TIMESTAMP),
                                                                       ('paul_walker', 'paul.walker@email.com', 'hashed_password_9', CURRENT_TIMESTAMP),
                                                                       ('amy_chen', 'amy.chen@email.com', 'hashed_password_10', CURRENT_TIMESTAMP);

-- Insert Workouts (15 workouts)
-- workout_type_id: 1=EMOM, 2=AMRAP, 3=For Time, 4=Tabata, 5=Ladder
-- score_type_id: 1=Time (For Time, Ladder), 2=Reps (EMOM, AMRAP, Tabata)
INSERT INTO workouts (name, description, workout_type_id, created_by_id, created_date, score_type_id) VALUES
                                                                                                          ('EMOM 10 Min Deadlifts', 'Every minute on the minute: 5 deadlifts at 70% 1RM', 1, 1, CURRENT_TIMESTAMP, 2),
                                                                                                          ('AMRAP 15 Min Squats', 'As many rounds as possible in 15 mins: 10 squats, 10 push-ups', 2, 2, CURRENT_TIMESTAMP, 2),
                                                                                                          ('For Time: 5K Run', 'Run 5 kilometers as fast as possible', 3, 3, CURRENT_TIMESTAMP, 1),
                                                                                                          ('Tabata Burpees', '8 rounds of 20 sec burpees, 10 sec rest', 4, 4, CURRENT_TIMESTAMP, 2),
                                                                                                          ('Ladder: Pull-Ups', '1 pull-up, rest, 2 pull-ups, rest, up to 10', 5, 5, CURRENT_TIMESTAMP, 1),
                                                                                                          ('EMOM 12 Min Snatches', 'Every minute: 3 squat snatches at 60% 1RM', 1, 6, CURRENT_TIMESTAMP, 2),
                                                                                                          ('AMRAP 20 Min Full Body', 'As many rounds as possible: 5 deadlifts, 10 lunges, 15 sit-ups', 2, 7, CURRENT_TIMESTAMP, 2),
                                                                                                          ('For Time: 21-15-9', '21-15-9 reps of thrusters and pull-ups', 3, 8, CURRENT_TIMESTAMP, 1),
                                                                                                          ('Tabata Push-Ups', '8 rounds of 20 sec push-ups, 10 sec rest', 4, 9, CURRENT_TIMESTAMP, 2),
                                                                                                          ('Ladder: Squat Cleans', '1 squat clean, rest, 2 squat cleans, rest, up to 8', 5, 10, CURRENT_TIMESTAMP, 1),
                                                                                                          ('EMOM 8 Min Burpees', 'Every minute: 10 burpees', 1, 1, CURRENT_TIMESTAMP, 2),
                                                                                                          ('AMRAP 12 Min Core', 'As many rounds as possible: 20 sit-ups, 30 planks, 40 mountain climbers', 2, 2, CURRENT_TIMESTAMP, 2),
                                                                                                          ('For Time: 10 Rounds', '10 rounds of 5 deadlifts, 10 push-ups, 15 air squats', 3, 3, CURRENT_TIMESTAMP, 1),
                                                                                                          ('Tabata Sprints', '8 rounds of 20 sec sprints, 10 sec rest', 4, 4, CURRENT_TIMESTAMP, 2),
                                                                                                          ('Ladder: Kettlebell Swings', '1 swing, rest, 2 swings, rest, up to 15', 5, 5, CURRENT_TIMESTAMP, 1);

-- Insert Workout Results (scores for members across workouts)
-- For Time (score_type_id=1) -> result as time in seconds
-- For Reps (score_type_id=2) -> result as number of reps or rounds
INSERT INTO workout_results (workout_id, created_by_id, result, created_date, duration, avg_heart_rate, calories_burned) VALUES
                                                                                                                             (1, 1, '60', CURRENT_TIMESTAMP, 600, 140, 300), -- EMOM 10 Min Deadlifts: 60 reps
                                                                                                                             (1, 2, '55', CURRENT_TIMESTAMP, 600, 135, 280),
                                                                                                                             (2, 3, '12', CURRENT_TIMESTAMP, 900, 150, 400), -- AMRAP 15 Min Squats: 12 rounds
                                                                                                                             (2, 4, '10', CURRENT_TIMESTAMP, 900, 145, 380),
                                                                                                                             (3, 5, '1800', CURRENT_TIMESTAMP, 1800, 160, 600), -- For Time: 5K Run: 1800 secs (30 mins)
                                                                                                                             (3, 6, '1750', CURRENT_TIMESTAMP, 1750, 155, 590),
                                                                                                                             (4, 7, '80', CURRENT_TIMESTAMP, 240, 130, 150), -- Tabata Burpees: 80 reps
                                                                                                                             (4, 8, '75', CURRENT_TIMESTAMP, 240, 125, 140),
                                                                                                                             (5, 9, '300', CURRENT_TIMESTAMP, 300, 140, 200), -- Ladder: Pull-Ups: 300 secs
                                                                                                                             (5, 10, '320', CURRENT_TIMESTAMP, 320, 135, 210),
                                                                                                                             (6, 1, '36', CURRENT_TIMESTAMP, 720, 145, 350), -- EMOM 12 Min Snatches: 36 reps
                                                                                                                             (7, 2, '8', CURRENT_TIMESTAMP, 1200, 150, 500), -- AMRAP 20 Min Full Body: 8 rounds
                                                                                                                             (8, 3, '600', CURRENT_TIMESTAMP, 600, 155, 400), -- For Time: 21-15-9: 600 secs
                                                                                                                             (9, 4, '90', CURRENT_TIMESTAMP, 240, 120, 130), -- Tabata Push-Ups: 90 reps
                                                                                                                             (10, 5, '400', CURRENT_TIMESTAMP, 400, 140, 250); -- Ladder: Squat Cleans: 400 secs

-- Insert Comments (lots of comments on various workouts)
INSERT INTO comments (workout_id, created_by_id, description, created_date) VALUES
                                                                                (1, 2, 'This EMOM was brutal! My legs are toast.', CURRENT_TIMESTAMP),
                                                                                (1, 3, 'Great workout, but I think I need to lower the weight next time.', CURRENT_TIMESTAMP),
                                                                                (2, 4, '12 rounds felt good! Push-ups slowed me down though.', CURRENT_TIMESTAMP),
                                                                                (2, 5, 'Solid AMRAP, loved the combo of movements.', CURRENT_TIMESTAMP),
                                                                                (3, 6, '30 mins for a 5K isn’t bad, but I’m aiming for sub-25 next time.', CURRENT_TIMESTAMP),
                                                                                (3, 7, 'Tough run! My calves were screaming by the end.', CURRENT_TIMESTAMP),
                                                                                (4, 8, 'Tabata burpees are no joke. Got 80 reps though!', CURRENT_TIMESTAMP),
                                                                                (4, 9, 'I underestimated this one. Completely gassed.', CURRENT_TIMESTAMP),
                                                                                (5, 10, 'Ladder format is awesome for pull-ups. Took me 5 mins.', CURRENT_TIMESTAMP),
                                                                                (5, 1, 'Really felt the burn by the 8th round!', CURRENT_TIMESTAMP),
                                                                                (6, 2, 'Snatches felt smooth today. 36 reps is a PR for me!', CURRENT_TIMESTAMP),
                                                                                (7, 3, '20 mins is a long time for an AMRAP. Only got 8 rounds.', CURRENT_TIMESTAMP),
                                                                                (8, 4, '21-15-9 was killer! Finished in 10 mins.', CURRENT_TIMESTAMP),
                                                                                (9, 5, 'Push-ups in Tabata format destroyed me. 90 reps though!', CURRENT_TIMESTAMP),
                                                                                (10, 6, 'Squat cleans in a ladder format are tough but fun.', CURRENT_TIMESTAMP),
                                                                                (11, 7, 'EMOM burpees are my nemesis. 10 per minute is rough.', CURRENT_TIMESTAMP),
                                                                                (12, 8, 'Core AMRAP was a nice change of pace. Got 10 rounds.', CURRENT_TIMESTAMP),
                                                                                (13, 9, '10 rounds for time took me 15 mins. Need to work on pacing.', CURRENT_TIMESTAMP),
                                                                                (14, 10, 'Tabata sprints were a great cardio blast!', CURRENT_TIMESTAMP),
                                                                                (15, 1, 'Kettlebell swings in a ladder format are addicting!', CURRENT_TIMESTAMP);