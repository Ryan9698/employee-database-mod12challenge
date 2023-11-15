import inquirer from "inquirer";
import mysql from "mysql2";

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Password123",
    database: "company_db",
  });
  
  db.connect((err) => {
    if (err) {
      console.error('Error connecting to the database: ' + err.stack);
      return;
    }
    console.log('Connected to the company_db database.');
  });
export const init = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "selection",
        message: "What would you like to do? (Use the arrow keys)",
        choices: [
          "View all employees",
          "Add Employee",
          "Update Employee Role",
          "View all Roles",
          "Add a Role",
          "View all Departments",
          "Add a Department",
          "Quit",
        ],
      },
    ])
    .then((answers) => {
      switch (answers.selection) {
        case "View all employees":
          viewAllEmployees();
          break;
        case "Quit":
          console.log("Goodbye!");
          process.exit();
        case "Add a Department":
          addDepartment();
          break;
        default:
          console.log("Invalid selection. Please try again.");
          init();
      }
    });
};
const viewAllEmployees = () => {
  const query = `
          SELECT employee.id, first_name, last_name, title, salary, department.name AS department
          FROM employee
          INNER JOIN role ON employee.role_id = role.id
          INNER JOIN department ON role.department_id = department.id
        `;
  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return;
    }
    console.table(results);
    init();
  });
};

const addDepartment = () => {
    inquirer
      .prompt([
        {
          type: "input",
          name: "departmentName",
          message: "Enter the name of the department:",
          validate: function (input) {
            if (!input) {
              return "Department name cannot be empty.";
            }
            return true;
          },
        },
      ])
      .then((answers) => {
        const departmentName = answers.departmentName;
  
        // SQL query to insert the new department into the database
        const query = `
          INSERT INTO department (name)
          VALUES ('${departmentName}')
        `;
  
        // Execute the query
        db.query(query, (err, results) => {
          if (err) {
            console.error(err);
            return;
          }
  
          console.log(`Department '${departmentName}' added to the database.`);
          // After adding the department, display all departments
          viewAllDepartments();
        });
      });
  };
  
  const viewAllDepartments = () => {
    const query = `SELECT * FROM department`;
  
    db.query(query, (err, results) => {
      if (err) {
        console.error(err);
        return;
      }
      console.table(results);
      init();
    });
  };
init();