INSERT INTO MEMBERS (id, username, email) VALUES
    (1, 'shane_test', 'shane.test@email.com');

INSERT INTO WORKOUTS (id, name, description, workout_type_id, created_by) VALUES
    (1, 'MELT', '20-15-10-5, C2B, Push Press (42.5kg/30kg), Burpee', 3, 1);

INSERT INTO WORKOUT_RESULTS (id, workout_id, member_id, result) VALUES
    (1, 1, 1, '10:00');

INSERT INTO COMMENTS (id, workout_id, member_id, comment) VALUES
    (1, 1, 1, 'Great workout!');
