const inquirer = require('inquirer');
const mysql = require('mysql2');
const consoleTable = require('console.table');


// This connects with the database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'dance5678!',
        database:'employee_db'
    }
)

const mainMenu = async () =>{
  const {backMenu} = await inquirer.prompt([
    {
      type: 'list',
      name: 'backMenu',
      message: 'Would you like to  go to the Main Menu or Quit?',
      choices: ['Main Menu', 'Quit']
    }
  ])

  switch (backMenu) {
    case 'Main Menu': displayMenu();
      break;
    case 'Quit': 
    console.log('Goodbye!');
    process.exit();
      break;
  }
}


const viewDepartments = () => {
  db.query('SELECT * FROM departments', (err, results) => {
      if (err) {
          console.log(err)
      } else {
          console.table(results);
      }
  })

  mainMenu()
}

const viewRoles = () => {
  db.query('SELECT * FROM roles', (err, results) => {
    if (err) {
      console.log(err)
    } else {
      console.table(results)
    }
  })

  mainMenu()
}

const viewEmployees = () => {
  db.query('SELECT * FROM employees', (err, results) => {
    if (err) {
      console.log(err)
    } else {
      console.table(results)
    } 
  })

  mainMenu()
}

const addDepartment = async () => {
  try {
    const newDepartment = await inquirer.prompt([
      {
        type: 'input',
        name: 'departmentName',
        message: 'Enter department name: ',
        validate: function (input) {
          if (!input) {
            return 'Please enter a department!';
          }
          return true;
        }
      }
    ]);
    const department = {name: newDepartment.departmentName};
    const res = await db.promise().query('INSERT INTO departments SET ?', department);
    console.log(`${res[0].affectedRows} department added!`);
  } catch (err){
    console.log(err)
  }

  mainMenu()
}

const addRole = async () => {
  try {

    const [rows] = await db.promise().query('SELECT * FROM departments');
    const departmentChoices = rows.map(row => (
      { 
        name: row.name, 
        value: row.id 
      }));

    const newRole = await inquirer.prompt([
      {
        type: 'input',
        name: 'title',
        message: 'Enter role name: ',
        validate: function (input) {
          if (!input) {
            return 'Please enter a title!';
          }
          return true;
        }
      },
      {
        type: 'input',
        name: 'salary',
        message: 'Enter salary amount: ',
        validate: function (input) {
          if ( isNaN(input) || input === '') {
            return 'Please enter a valid number'
          }
          return true;
        }
      },
      {
        type: 'list',
        name: 'department_id',
        message: 'Select the department id for this role',
        choices: departmentChoices
      }
    ])

 await db.promise().query('INSERT INTO roles SET ?',{ 
  title: newRole.title,
  salary: newRole.salary,
  department_id: newRole.department_id
});
    console.log(`${newRole.title} added to roles! `)
  } catch (err){
    console.log(err)
  }

  mainMenu()
}

const getManagers = async () => {
  const query = `SELECT CONCAT(first_name, ' ', last_name) AS name, id FROM employees WHERE manager_id IS NULL`;
  
  try {
    const [rows] = await db.promise().query(query);
    const managers = rows.map(row => (
      { name: row.name, 
        value: row.id }
        ));

      if (managers.length === 0){
        return null
      } else{
      return managers
    };
  } catch (err) {
    console.log(err);
  }
};


const addEmployee =  async () => {
  try {
    const [rolesRows] = await db.promise().query('SELECT * FROM roles');
    const roleChoices = rolesRows.map(row => (
      { 
        name: row.title, 
        value: row.id 
      }));

    const managers = await getManagers();

    const newEmployee = await inquirer.prompt([
      {
        type: 'input',
        name: 'first_name',
        message: 'Enter first name: ',
        validate: function (input) {
          if (!input) {
            return 'Please enter your first name!';
          }
          return true;
        }
      },
      {
        type: 'input',
        name: 'last_name',
        message: 'Enter last name: ',
        validate: function (input) {
          if (!input) {
            return 'Please enter your last name!';
          }
          return true;
        }
      },
      {
        type: 'list',
        name: 'role_id',
        message: 'Select the role for this employee',
        choices: roleChoices
      },
      {
        type: 'list',
        message: "Select the employee's manager.",
        choices: managers ? [...managers, 'None'] : ['None'],
        name: 'manager_id'
    }
    ]);

    const managerId = newEmployee.manager_id === 'None' ? null : newEmployee.manager_id;

    await db.promise().query('INSERT INTO employees SET ?',{ 
      first_name: newEmployee.first_name,
      last_name: newEmployee.last_name,
      role_id: newEmployee.role_id,
      manager_id: managerId
    });

    console.log(`${newEmployee.first_name} ${newEmployee.last_name} added to employees! `)
  } catch (err){
    console.log(err)
  }

  mainMenu()
}



const displayMenu = async () => {
  const { menuChoice } = await inquirer.prompt([
    {
      type: 'list',
      name: 'menuChoice',
      message: 'What would you like to do?',
      choices: [
        'View all departments',
        'View all roles',
        'View all employees',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update an employee role',
        'Exit'
      ]
    }
  ])

  switch (menuChoice) {
    case 'View all departments': viewDepartments();
      break;
    case 'View all roles': viewRoles();
      break;
    case 'View all employees': viewEmployees();
      break;
    case 'Add a department': addDepartment();
      break;
    case 'Add a role': addRole()
      break;
    case 'Add an employee': addEmployee();
      break;
    case 'Update an employee role': updateEmployee();
      break;
    case 'Exit':
      console.log('Goodbye!');
      process.exit()
      break;
    default:
      console.log('Invalid choice');
      break;
    }

  }

// Call to start the program

displayMenu();
