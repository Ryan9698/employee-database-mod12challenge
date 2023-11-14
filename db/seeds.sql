INSERT INTO department (id, name) 

VALUES (1, 'Customer Service'),
       (2, 'Meat/Seafood'),
       (3, 'Deli');

INSERT INTO role (id, title, salary, department_id) 

VALUES (1, 'CS Staff', 35000, 1),
       (2, 'CS Manager', 56000, 1),
       (3, 'Meat Cutter', 48000, 2),
       (4, 'Meat Manager', 70000, 2),
       (5, 'Deli Clerk', 39000, 3),

INSERT INTO employee (id, first_name, last_name, role_id, manager_id) 

VALUES (1, 'John', 'Doe', 1, NULL),
       (2, 'Jane', 'Smith', 2, 1),
       (3, 'Bob', 'Johnson', 2, 1),
       (4, 'Alice', 'Williams', 3, NULL),
       (5, 'Charlie', 'Brown', 3, 4),
       (6, 'Eva', 'Jones', 3, 4);