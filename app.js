const mysql = require('mysql');
const inquirer = require('inquirer');
const { printTable } = require('console-table-printer');
var roles;
var departments;
var managers;
var employees;

var connection = mysql.createConnection({
    host: "localhost",
  
    port: 3306,
  
    user: "root",
    password: "Md5;ibanez1245",
    database: "employees_db"
  });

  connection.connect(function(err) {
    if (err) throw err;
    start();
    getDepartments();
    getRoles();
    getManagers();
    getEmployees();
  });
