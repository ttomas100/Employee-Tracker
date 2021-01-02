DROP DATABASE IF EXISTS employees_db;
CREATE DATABASE employees_db;

USE employees_db;

CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL(10,2) NOT NULL,
  department_id INT, 
  PRIMARY KEY (id)
);

CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR (30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT NOT NULL, 
  manager_id INT, 
  PRIMARY KEY (id)
);


INSERT INTO department (name)
VALUES ("Marketing"), ("Engineering"), ("Human Resources"), ("Legal"), ("Finance"), ("Digital");

INSERT INTO role (title, salary, department_id)
VALUES ("SEO", "100000", "7"), ("Software Engineer", "150000", "2"), ("Lawyer", "100000", "3"), ("Lawyer", "60000", "4"), ("Actuary", "60000", "5"), ("Digital Marketer", "70000", "6"), ("Salesperson", "40000", "1");

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Tomas", "Utreras","2", "1"), ("Estefania", "Rodriguez","2", "2"), ("Juan", "Sanchez", "3", "3"), ("Ted", "Cruz", "4", "4"), ("Fausto", "Lopez", "5", "5"), ("Lucas", "Acevedo", "6", "6"), ("Jordan", "Michael", "6", "7");

SELECT e.id, e.first_name, e.last_name, d.name AS department, r.title, r.salary, CONCAT_WS(" ", m.first_name, m.last_name) AS manager FROM employee e LEFT JOIN employee m ON m.id = e.manager_id INNER JOIN role r ON e.role_id = r.id INNER JOIN department d ON r.department_id = d.id ORDER BY e.id ASC;


SELECT  r.id, r.title, r.salary, d.name as Department_Name FROM role AS r INNER JOIN department AS d ON r.department_id = d.id;

SELECT id, CONCAT_WS(' ', first_name, last_name) AS Employee_Name FROM employee;

