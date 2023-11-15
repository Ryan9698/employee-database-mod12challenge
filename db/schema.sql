DROP DATABASE IF EXISTS company_db;
CREATE DATABASE company_db;

USE company_db;

CREATE TABLE department (
  id INT AUTO_INCREMENT NOT NULL, 
  name VARCHAR(30) NOT NULL, 
  PRIMARY KEY(id)
);

CREATE TABLE role (
  id INT NOT NULL, 
  title VARCHAR(30) NOT NULL,
  salary DECIMAL,
  department_id INT NOT NULL, 
  PRIMARY KEY(id),
  FOREIGN KEY(department_id) REFERENCES department(id)
);

CREATE TABLE employee (
  id INT NOT NULL,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT NOT NULL,
  manager_id INT, 
  PRIMARY KEY(id),
  FOREIGN KEY(role_id) REFERENCES role(id),
  FOREIGN KEY(manager_id) REFERENCES employee(id)
);

