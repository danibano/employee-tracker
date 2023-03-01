USE employee_db;

-- Insert data into the departments table
INSERT INTO departments (name)
VALUES 
    ('Singers'), 
    ('Dancers'), 
    ('Acting'), 
    ('Wardrobe');

-- Insert data into the roles table
INSERT INTO roles (title, salary, department_id)
VALUES ('Vocal Coach', 90000, 1),
       ('Lead Singer', 80000, 1),
       ('Backup Vocalist', 50000,1),
       ('Choreographer', 75000, 2),
       ('Backup Dancer', 40000, 2),
       ('Talent Manager', 100000, 3),
       ('Actor', 95000, 3),
       ('Actoress', 95000, 3),
       ('Wardrobe Manager', 80000, 4),
       ('Make Up Artist', 70000, 4),
       ('Costume Designer', 85000, 4);

-- Insert data into the employees table
INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES 
    ('Mariah', 'Carey', 1, NULL),
    ('Ariana', 'Grande', 2, 1),
    ('Olivia', 'Rodgrigo', 3, 1),
    ('Sean', 'Lew', 4, NULL),
    ('Kaycee', 'Rice', 5, 4),
    ('Selena', 'Gomez', 6, NULL),
    ('Tom', 'Holland', 7, 6),
    ('Zendaya', 'Coleman', 8, 6),
    ('Louis', 'Vuitton', 9, NULL),
    ('Bretman', 'Rock', 10, 9),
    ('Marc', 'Jacobs', 11, 9);