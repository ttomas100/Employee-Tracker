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

  start = () => {

    inquirer
      .prompt({
        name: "choices",
        type: "list",
        message: "Please choose one of the following options:",
        choices: ["ADD", "VIEW", "UPDATE", "DELETE", "EXIT"]
      })
      .then(function(answer) {
        if (answer.choices === "ADD") {
          addEmployee();
        }
        else if (answer.choices === "VIEW") {
          viewEmployee();
        } 
        else if (answer.choices === "UPDATE") {
          updateEmployee();
        }
        else if (answer.choices === "DELETE") {
          deleteEmployee();
        }
        else if (answer.choices === "EXIT") {  
          connection.end();
        }
        else{
          connection.end();
        }
      });
  }

getRoles = () => {
  connection.query("SELECT id, title FROM role", (err, res) => {
    if (err) throw err;
    roles = res;
  
  })
};

getDepartments = () => {
  connection.query("SELECT id, name FROM department", (err, res) => {
    if (err) throw err;
    departments = res;

  })
};

getManagers = () => {
  connection.query("SELECT id, first_name, last_name, CONCAT_WS(' ', first_name, last_name) AS managers FROM employee", (err, res) => {
    if (err) throw err;
    managers = res;

  })
};

getEmployees = () => {
  connection.query("SELECT id, CONCAT_WS(' ', first_name, last_name) AS Employee_Name FROM employee", (err, res) => {
    if (err) throw err;
    employees = res;

  })
};

addEmployee = () => {
  inquirer.prompt([ 
    {
      name: "add",
      type: "list",
      message: "Choose what you want to add",
      choices: ["DEPARTMENT", "ROLE", "EMPLOYEE", "EXIT"]
    }
  ]).then(function(answer) {
    if (answer.add === "DEPARTMENT") {
      console.log("Add a new: " + answer.add);
      addDepartment();
    }
    else if (answer.add === "ROLE") {
      console.log("Add a new: " + answer.add);
      addRole();
    }
    else if (answer.add === "EMPLOYEE") {
      console.log("Add a new: " + answer.add);
      addEmployee();
    } 
    else if (answer.add === "EXIT") {
      connection.end();
    } else {
      connection.end();
    }
  })
};

addDepartment = () => {
  inquirer.prompt([
    {
      name: "department",
      type: "input",
      message: "Type the department that you want to add"
    }
  ]).then(function(answer) {
    connection.query(`INSERT INTO department (name) VALUES ('${answer.department}')`, (err, res) => {
      if (err) throw err;
      console.log("1 new department added: " + answer.department);
      getDepartments();
      start();
    }) 
  })
};

addRole = () => {
  let departmentOptions = [];
  for (i = 0; i < departments.length; i++) {
    departmentOptions.push(Object(departments[i]));
  };

  inquirer.prompt([
    {
      name: "title",
      type: "input",
      message: "Type the role that you want to add"
    },
    {
      name: "salary",
      type: "input",
      message: "Type the salary for this possition"
    },
    {
      name: "department_id",
      type: "list",
      message: "Type the department for this possition",
      choices: departmentOptions
    },
  ]).then(function(answer) {
    for (i = 0; i < departmentOptions.length; i++) {
      if (departmentOptions[i].name === answer.department_id) {
        department_id = departmentOptions[i].id
      }
    }
    connection.query(`INSERT INTO role (title, salary, department_id) VALUES ('${answer.title}', '${answer.salary}', ${department_id})`, (err, res) => {
      if (err) throw err;

      console.log("1 new role added: " + answer.title);
      getRoles();
      start();
    }) 
  })
};

addEmployee = () => {
  getRoles();
  getManagers();
  let roleOptions = [];
  for (i = 0; i < roles.length; i++) {
    roleOptions.push(Object(roles[i]));
  };
  let managerOptions = [];
  for (i = 0; i < managers.length; i++) {
    managerOptions.push(Object(managers[i]));
  }
  inquirer.prompt([
    {
      name: "first_name",
      type: "input",
      message: "What is the employee's first name?"
    },
    {
      name: "last_name",
      type: "input",
      message: "What is the employee's last name?"
    },
    {
      name: "role_id",
      type: "list",
      message: "What is the role for this employee?",
      choices: function() {
        var choiceArray = [];
        for (var i = 0; i < roleOptions.length; i++) {
          choiceArray.push(roleOptions[i].title)
        }
        return choiceArray;
      }
    },
    {
      name: "manager_id",
      type: "list",
      message: "Who is the employee's manager?",
      choices: function() {
        var choiceArray = [];
        for (var i = 0; i < managerOptions.length; i++) {
          choiceArray.push(managerOptions[i].managers)
        }
        return choiceArray;
      }
    }
  ]).then(function(answer) {
    for (i = 0; i < roleOptions.length; i++) {
      if (roleOptions[i].title === answer.role_id) {
        role_id = roleOptions[i].id
      }
    }

    for (i = 0; i < managerOptions.length; i++) {
      if (managerOptions[i].managers === answer.manager_id) {
        manager_id = managerOptions[i].id
      }
    }

    connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${answer.first_name}', '${answer.last_name}', ${role_id}, ${manager_id})`, (err, res) => {
      if (err) throw err;

      console.log("1 new employee added: " + answer.first_name + " " + answer.last_name);
      getEmployees();
      start()
    }) 
  })
};

viewEmployee = () => {
  inquirer.prompt([
    {
      name: "viewChoice",
      type: "list",
      message: "What would you like to view?",
      choices: ["DEPARTMENTS", "ROLES", "EMPLOYEES", "EXIT"]
    }
  ]).then(answer => {
    if (answer.viewChoice === "DEPARTMENTS") {
      viewDepartments();
    }
    else if (answer.viewChoice === "ROLES") {
      viewRoles();
    }
    else if (answer.viewChoice === "EMPLOYEES") {
      viewEmployees();
    }
    else if (answer.viewChoice === "EXIT") {
    connection.end();
    } else {
      connection.end();
    }
  })
};

viewDepartments = () => {
  connection.query("SELECT * FROM department", (err, res) => {
    if (err) throw err;
   
    printTable(res);
    start();
  });
};

viewRoles = () => {
  connection.query("SELECT  r.id, r.title, r.salary, d.name as Department_Name FROM role AS r INNER JOIN department AS d ON r.department_id = d.id", (err, res) => {
    if (err) throw err;
    printTable(res);
    start();
  });
};

viewEmployees = () => {
  connection.query('SELECT e.id, e.first_name, e.last_name, d.name AS department, r.title, r.salary, CONCAT_WS(" ", m.first_name, m.last_name) AS manager FROM employee e LEFT JOIN employee m ON m.id = e.manager_id INNER JOIN role r ON e.role_id = r.id INNER JOIN department d ON r.department_id = d.id ORDER BY e.id ASC', (err, res) => {
    if (err) throw err;
    printTable(res);
    start();
  });
};
