const inquirer = require('inquirer');

// Define an array of options for the menu
const menuOptions = [
  { name: 'View all departments', value: 'viewDepartments' },
  { name: 'View all roles', value: 'viewRoles' },
  { name: 'View all employees', value: 'viewEmployees' },
  { name: 'Add a department', value: 'addDepartment' },
  { name: 'Add a role', value: 'addRole' },
  { name: 'Add an employee', value: 'addEmployee' },
  { name: 'Update an employee role', value: 'updateEmployeeRole' },
  { name: 'Exit', value: 'exit' },
];

// Define a function that displays the menu and prompts the user to choose an option
async function displayMenu() {
  console.log('\n');
  const { menuOption } = await inquirer.prompt([
    {
      type: 'list',
      name: 'menuOption',
      message: 'What would you like to do?',
      choices: menuOptions,
    },
  ]);
  console.log('\n');
  return menuOption;
}

// Define a loop that displays the menu and performs actions based on the user's choice
async function mainLoop() {
  let continueLoop = true;
  while (continueLoop) {
    const choice = await displayMenu();
    switch (choice) {
      case 'viewDepartments':
        // Code to view all departments
        break;
      case 'viewRoles':
        // Code to view all roles
        break;
      case 'viewEmployees':
        // Code to view all employees
        break;
      case 'addDepartment':
        // Code to add a department
        break;
      case 'addRole':
        // Code to add a role
        break;
      case 'addEmployee':
        // Code to add an employee
        break;
      case 'updateEmployeeRole':
        // Code to update an employee's role
        break;
      case 'exit':
        continueLoop = false;
        break;
      default:
        console.log('Invalid choice');
        break;
    }
  }
  console.log('Goodbye!');
}

// Call the main loop to start the program
mainLoop();
