INSERT INTO MEMBERS (id, "UserName", "Email", "EmailConfirmed", "AccessFailedCount", "ConcurrencyStamp", "LockoutEnabled", "LockoutEnd", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "PhoneNumber", "PhoneNumberConfirmed", "SecurityStamp", "TwoFactorEnabled") VALUES
    (1, 'shane_test', 'shane.test@email.com', true, 0, 'concurrency_stamp_1', false, NULL, 'SHANE.TEST@EMAIL.COM', 'SHANE_TEST', 'password_hash_1', NULL, false, 'security_stamp_1', false),
    (2, 'mark_brown', 'mark.test@email.com', true, 0, 'concurrency_stamp_2', false, NULL, 'MARK.TEST@EMAIL.COM', 'MARK_BROWN', 'password_hash_2', NULL, false, 'security_stamp_2', false),
    (3, 'john_doe', 'john.doe@email.com', true, 0, 'concurrency_stamp_3', false, NULL, 'JOHN.DOE@EMAIL.COM', 'JOHN_DOE', 'password_hash_3', NULL, false, 'security_stamp_3', false),
    (4, 'jane_smith', 'jane.smith@email.com', true, 0, 'concurrency_stamp_4', false, NULL, 'JANE.SMITH@EMAIL.COM', 'JANE_SMITH', 'password_hash_4', NULL, false, 'security_stamp_4', false),
    (5, 'alice_jones', 'alice.jones@email.com', true, 0, 'concurrency_stamp_5', false, NULL, 'ALICE.JONES@EMAIL.COM', 'ALICE_JONES', 'password_hash_5', NULL, false, 'security_stamp_5', false),
    (6, 'bob_brown', 'bob.brown@email.com', true, 0, 'concurrency_stamp_6', false, NULL, 'BOB.BROWN@EMAIL.COM', 'BOB_BROWN', 'password_hash_6', NULL, false, 'security_stamp_6', false),
    (7, 'charlie_black', 'charlie.black@email.com', true, 0, 'concurrency_stamp_7', false, NULL, 'CHARLIE.BLACK@EMAIL.COM', 'CHARLIE_BLACK', 'password_hash_7', NULL, false, 'security_stamp_7', false),
    (8, 'david_white', 'david.white@email.com', true, 0, 'concurrency_stamp_8', false, NULL, 'DAVID.WHITE@EMAIL.COM', 'DAVID_WHITE', 'password_hash_8', NULL, false, 'security_stamp_8', false),
    (9, 'eve_green', 'eve.green@email.com', true, 0, 'concurrency_stamp_9', false, NULL, 'EVE.GREEN@EMAIL.COM', 'EVE_GREEN', 'password_hash_9', NULL, false, 'security_stamp_9', false),
    (10, 'frank_blue', 'frank.blue@email.com', true, 0, 'concurrency_stamp_10', false, NULL, 'FRANK.BLUE@EMAIL.COM', 'FRANK_BLUE', 'password_hash_10', NULL, false, 'security_stamp_10', false);

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