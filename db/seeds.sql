INSERT INTO department (name) 

VALUES ( 'Customer Service'),
       ( 'Meat/Seafood'),
       ( 'Deli');

INSERT INTO role (title, salary, department_id) 

VALUES ( 'CS Staff', 35000, 1),
       ( 'CS Manager', 56000, 1),
       ( 'Meat Cutter', 48000, 2),
       ( 'Meat Manager', 70000, 2),
       ( 'Deli Clerk', 39000, 3),
       ( 'Deli Manager', 61000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id) 

VALUES ( 'John', 'Doe', 2, NULL),
       ( 'Jane', 'Smith', 1, 1),
       ( 'Bob', 'Johnson', 1, 1),
       ( 'Alice', 'Williams', 4, NULL),
       ( 'Charlie', 'Brown', 3, 4),
       ( 'Eva', 'Jones', 6, NULL),
       ( 'Danielle', 'Johnson', 5, 6);