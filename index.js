import inquirer from 'inquirer';

export const init = () => {
       inquirer
        .prompt([
          {
            type: 'list',
            name: 'selection',
            message: 'What would you like to do? (Use the arrow keys)',
            choices: ["View all employees", "Add Employee", "Update Employee Role", "View all Roles", "Add a Role", "View all Departments", "Add a Department","Quit"]
          }
        ])
        .then((answers) => {
          switch (answers.selection) {
            case "View all employees":
            viewAllEmployees();
            break;
          case "Quit":
            console.log("Goodbye!");
            process.exit();
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


    init();