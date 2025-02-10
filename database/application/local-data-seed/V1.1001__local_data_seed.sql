INSERT INTO MEMBERS (id, username, email) VALUES
    (1, 'shane_test', 'shane.test@email.com'),
    (2, 'mark_brown', 'mark.test@email.com'),
    (3, 'john_doe', 'john.doe@email.com'),
    (4, 'jane_smith', 'jane.smith@email.com'),
    (5, 'alice_jones', 'alice.jones@email.com'),
    (6, 'bob_brown', 'bob.brown@email.com'),
    (7, 'charlie_black', 'charlie.black@email.com'),
    (8, 'david_white', 'david.white@email.com'),
    (9, 'eve_green', 'eve.green@email.com'),
    (10, 'frank_blue', 'frank.blue@email.com');

ALTER SEQUENCE members_id_seq RESTART WITH 11;

INSERT INTO WORKOUTS (id, name, description, workout_type_id, created_by) VALUES
    (1, 'MELT', '20-15-10-5, C2B, Push Press (42.5kg/30kg), Burpee', 3, 1);

ALTER SEQUENCE workouts_id_seq RESTART WITH 2;

INSERT INTO WORKOUT_RESULTS (id, workout_id, member_id, result) VALUES
    (1, 1, 1, '10:00'),
    (2, 1, 2, '15:00'),
    (3, 1, 3, '12:30'),
    (4, 1, 4, '11:45'),
    (5, 1, 5, '13:20'),
    (6, 1, 6, '14:10'),
    (7, 1, 7, '09:50'),
    (8, 1, 8, '10:30'),
    (9, 1, 9, '11:00'),
    (10, 1, 10, '12:00');

ALTER SEQUENCE workout_results_id_seq RESTART WITH 11;

INSERT INTO COMMENTS (id, workout_id, member_id, description) VALUES
    (1, 1, 1, 'Great workout!'),
    (2, 1, 2, 'I really struggled with the C2B'),
    (3, 1, 3, 'Felt amazing!'),
    (4, 1, 4, 'Could have done better'),
    (5, 1, 5, 'Loved the push press'),
    (6, 1, 6, 'Burpees were tough'),
    (7, 1, 7, 'Great pace!'),
    (8, 1, 8, 'Enjoyed it'),
    (9, 1, 9, 'Good workout'),
    (10, 1, 10, 'Challenging but fun');

ALTER SEQUENCE comments_id_seq RESTART WITH 11;