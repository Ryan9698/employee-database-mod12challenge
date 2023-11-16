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
    console.error("Error connecting to the database: " + err.stack);
    return;
  }
  console.log("Connected to the company_db database.");
});

const init = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "selection",
        message: "What would you like to do? (Use the arrow keys)",
        choices: [
          "View All Employees",
          "Add Employee",
          "Update Employee Role",
          "View All Roles",
          "Add a Role",
          "View All Departments",
          "Add a Department",
          "Quit",
        ],
      },
    ])
    .then((answers) => {
      switch (answers.selection) {
        case "View All Employees":
          viewAllEmployees();
          break;
        case "Quit":
          console.log("Goodbye!");
          process.exit();
        case "Add a Department":
          addDepartment();
          break;
        case "Add a Role":
          addRole();
          break;
        case "Add Employee":
          addEmployee();
          break;
        case "View All Roles":
          allRoles();
          break;
        case "View All Departments":
          viewAllDepartments();
          break;
        case "Update Employee Role":
          updateEmployeeRole();
          break;
        default:
          console.log("Invalid selection. Please try again.");
          init();
      }
    });
};
const viewAllEmployees = () => {
  const query = `
    SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department,
    CONCAT(manager.first_name, ' ', manager.last_name) AS manager_name
    FROM employee
    INNER JOIN role ON employee.role_id = role.id
    INNER JOIN department ON role.department_id = department.id
    LEFT JOIN employee AS manager ON employee.manager_id = manager.id
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

      const query = `
          INSERT INTO department (name)
          VALUES ('${departmentName}')
        `;

      db.query(query, (err, results) => {
        if (err) {
          console.error(err);
          return;
        }

        console.log(`Department '${departmentName}' added to the database.`);
        init();
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

const addRole = () => {
  const departmentQuery = `SELECT id, name FROM department`;
  db.query(departmentQuery, (err, departments) => {
    if (err) {
      console.error(err);
      return;
    }

    const departmentChoices = departments.map((dept) => ({
      name: dept.name,
      value: dept.id,
    }));

    inquirer
      .prompt([
        {
          type: "input",
          name: "title",
          message: "What is the title of the new role?",
        },
        {
          type: "input",
          name: "salary",
          message: "Please enter the salary for the new role (Ex: 80000.00)",
          validate: function (value) {
            const valid = !isNaN(parseFloat(value));
            return valid || "Please enter a valid number for the salary.";
          },
        },
        {
          type: "list",
          name: "departmentId",
          message: "What department does this role belong to?",
          choices: departmentChoices,
        },
      ])
      .then((answers) => {
        const { title, salary, departmentId } = answers;

        const query = `
            INSERT INTO role (title, salary, department_id)
            VALUES ('${title}', ${parseFloat(salary)}, ${parseInt(
          departmentId
        )})
          `;

        db.query(query, (err, results) => {
          if (err) {
            console.error(err);
            return;
          }

          console.log(`Role '${title}' added to the database.`);
          init();
        });
      });
  });
};

const getRoles = () => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM role", (err, roles) => {
      if (err) {
        reject(err);
      } else {
        resolve(roles);
      }
    });
  });
};

const getManagers = (departmentId) => {
  return new Promise((resolve, reject) => {
    const query = `
        SELECT employee.id, employee.first_name, employee.last_name
        FROM employee
        INNER JOIN role ON employee.role_id = role.id
        WHERE role.department_id = ?
        `;

    db.query(query, [departmentId], (err, managers) => {
      if (err) {
        reject(err);
      } else {
        resolve(managers);
      }
    });
  });
};

const addEmployee = () => {
  Promise.all([getRoles(), getManagers()])
    .then(([roles, managers]) => {
      inquirer
        .prompt([
          {
            type: "input",
            name: "firstName",
            message: "Enter the first name of the employee:",
          },
          {
            type: "input",
            name: "lastName",
            message: "Enter the last name of the employee:",
          },
          {
            type: "list",
            name: "roleId",
            message: "Select the role for the employee:",
            choices: roles.map((role) => ({
              name: role.title,
              value: role.id,
            })),
          },
        ])
        .then((answers) => {
          const { firstName, lastName, roleId } = answers;

          const departmentId = roles.find(
            (role) => role.id === roleId
          )?.department_id;

          getManagers(departmentId)
            .then((managers) => {
              inquirer
                .prompt([
                  {
                    type: "list",
                    name: "managerId",
                    message: "Select the manager for the employee:",
                    choices: managers.map((manager) => ({
                      name: `${manager.first_name} ${manager.last_name}`,
                      value: manager.id,
                    })),
                    default: "None",
                  },
                ])
                .then((managerAnswer) => {
                  const { managerId } = managerAnswer;

                  const query = `
                      INSERT INTO employee (first_name, last_name, role_id, manager_id)
                      VALUES (?, ?, ?, ?)
                    `;

                  db.query(
                    query,
                    [firstName, lastName, roleId, managerId],
                    (err, result) => {
                      if (err) {
                        console.error(err);
                        return;
                      }
                      console.log("Employee added successfully!");
                      init();
                    }
                  );
                });
            })
            .catch((err) => {
              console.error(err);
            });
        });
    })
    .catch((err) => {
      console.error(err);
    });
};

const allRoles = () => {
  const query = `
      SELECT role.id AS role_id, role.title AS job_title, role.salary, department.name AS department_name
      FROM role
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

const updateEmployeeRole = () => {
  const employeesQuery = `SELECT id, CONCAT(first_name, ' ', last_name) AS full_name FROM employee`;

  db.query(employeesQuery, (err, employees) => {
    if (err) {
      console.error(err);
      return;
    }

    const employeeChoices = employees.map((emp) => ({
      name: emp.full_name,
      value: emp.id,
    }));

    const departmentsQuery = `SELECT id, name FROM department`;
    db.query(departmentsQuery, (err, departments) => {
      if (err) {
        console.error(err);
        return;
      }

      const departmentChoices = departments.map((dept) => ({
        name: dept.name,
        value: dept.id,
      }));

      inquirer
        .prompt([
          {
            type: "list",
            name: "employeeId",
            message: "Select the employee you wish to update:",
            choices: employeeChoices,
          },
          {
            type: "list",
            name: "departmentId",
            message: "Select the department for the new role:",
            choices: departmentChoices,
          },
        ])
        .then((answers) => {
          const { employeeId, departmentId } = answers;

          const rolesQuery = `SELECT id, title FROM role WHERE department_id = ${departmentId}`;
          db.query(rolesQuery, (err, roles) => {
            if (err) {
              console.error(err);
              return;
            }

            const roleChoices = roles.map((role) => ({
              name: role.title,
              value: role.id,
            }));

            inquirer
              .prompt([
                {
                  type: "list",
                  name: "roleId",
                  message: "Select a new role for the employee:",
                  choices: roleChoices,
                },
              ])
              .then((roleAnswer) => {
                const { roleId } = roleAnswer;

                const updateQuery = `
                    UPDATE employee
                    SET role_id = ${roleId}
                    WHERE id = ${employeeId}
                  `;

                db.query(updateQuery, (err, result) => {
                  if (err) {
                    console.error(err);
                    return;
                  }
                  console.log("Employee role updated successfully!");
                  init();
                });
              });
          });
        });
    });
  });
};

init();
