const inquirer = require('inquirer');
const mysql = require('mysql2');
const consoleTable = require('console.table');
const { up } = require('inquirer/lib/utils/readline');


// This connects with the database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'dance5678!',
        database:'employee_db'
    }
);

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
};


const viewDepartments = () => {
  db.query('SELECT * FROM departments', (err, results) => {
      if (err) {
          console.log(err)
      } else {
          console.table(results);
      }
  })

  mainMenu()
};

const viewRoles = () => {
  db.query('SELECT * FROM roles', (err, results) => {
    if (err) {
      console.log(err)
    } else {
      console.table(results)
    }
  })

  mainMenu()
};

const viewEmployees = () => {
  db.query('SELECT * FROM employees', (err, results) => {
    if (err) {
      console.log(err)
    } else {
      console.table(results)
    } 
  })

  mainMenu()
};

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
};

 const getDepartment = async () => {
  try {
    const [rows] = await db.promise().query('SELECT * FROM departments');
    const departmentChoices = rows.map(row => (
      { 
        name: row.name, 
        value: row.id 
      }));

    return departmentChoices;
  } catch (err) {
    console.log(err)
  }
}

const addRole = async () => {
  try {

    const department = await getDepartment();

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
        choices: department
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
};

const getManagers = async () => {
  const query = `SELECT CONCAT(first_name, ' ', last_name) AS name, id FROM employees WHERE manager_id IS NULL`;
  
  try {
    const [rows] = await db.promise().query(query);
    const managers = rows.map(row => (
      { name: row.name, 
        value: row.id 
      }));

      if (managers.length === 0){
        return null
      } else{
      return managers
    };
  } catch (err) {
    console.log(err);
  }
};

const getRoles = async () => {
  try {
    const [rolesRows] = await db.promise().query('SELECT * FROM roles');
    const roleChoices = rolesRows.map(row => (
      { 
        name: row.title, 
        value: row.id 
      }));
      
      return roleChoices;
    } catch (err) {
      console.log(err)
    }
};

const getEmployees = async () => {
  try {
    const [employeeRows] = await db.promise().query('SELECT * FROM employees');
    const employeeChoices = employeeRows.map(row => (
      { 
        name: `${row.first_name} ${row.last_name}`, 
        value: row.id 
      }));

      return employeeChoices
    } catch (err) {
      console.log(err)
    };
};


const addEmployee =  async () => {
  try{
    const managers = await getManagers();
    const roles = await getRoles();

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
        choices: roles
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

    console.log(`${newEmployee.first_name} ${newEmployee.last_name} added to employees! `);
  } catch (err){
    console.log(err)
  }

  mainMenu()
}

const updateEmployee = async () => {
  try {
      const employees = await getEmployees();
      const managers = await getManagers();
      const roles = await getRoles();

      const updatedEmployee = await inquirer.prompt([
        {
          type: 'list',
          name: 'employee_id',
          message: 'Which employee would you life to update?',
          choices: employees
        },
        {
          type: 'input',
          name: 'first_name',
          message: 'Enter the updated first name: ',
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
          message: 'Enter updated last name: ',
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
          message: 'Select the new role for this employee',
          choices: roles
        },
        {
          type: 'list',
          message: "Select the employee's manager.",
          choices: managers ? [...managers, 'None'] : ['None'],
          name: 'manager_id'
        }
      ]);

      await db.promise().query('UPDATE employees SET ? WHERE id = ?', [
        {
          first_name: updatedEmployee.first_name,
          last_name: updatedEmployee.last_name,
          role_id: updatedEmployee.role_id,
          manager_id: updatedEmployee.manager_id
        },
        updatedEmployee.employee_id
      ])

      console.log(`Employee with ID ${updatedEmployee.employee_id} has been updated!`)
  } catch (err) {
    console.log(err)
  }

mainMenu()
};

const updateManager = async () => {
  try {
    const employees = await getEmployees();
    const managers = await getManagers();
    const { employee_id, manager_id } = await inquirer.prompt([
      {
        type: 'list',
        name: 'employee_id',
        message: 'Which employee would you like to update?',
        choices: employees
      },
      {
        type: 'list',
        name: 'manager_id',
        message: 'Select the new manager for this employee',
        choices: managers
      }
    ]);

    await db.promise().query('UPDATE employees SET manager_id = ? WHERE id = ?', [manager_id, employee_id]);

    console.log(`Employee ${employee_id} has been updated with new manager ${manager_id}.`);
  } catch (err) {
    console.log(err);
  }

  mainMenu();

};

const viewEmployeeManager = async () => {
  try{
    const managers = await getManagers();
    const { manager_id } = await inquirer.prompt([
      {
        type: 'list',
        name: 'manager_id',
        message: 'Select the manager to view employees',
        choices: managers
      }
    ]);

    const query = `SELECT CONCAT(first_name, ' ', last_name) AS name, title 
                   FROM employees 
                   JOIN roles ON employees.role_id = roles.id 
                   WHERE manager_id = ?`;

    const [employeeRows] = await db.promise().query(query, [manager_id]);

    console.table(employeeRows);
  } catch (err) {
    console.log(err);
  }

  mainMenu();
};

const viewEmployeeDepartment = async () => {
  try {
    const department = await getDepartment();
    const { department_id } = await inquirer.prompt([
      {
        type: 'list',
        name: 'department_id',
        message: 'Select a department to view employees:',
        choices: department
      }
    ]);

    const [employeesRows] = await db.promise().query(`
      SELECT e.id, e.first_name, e.last_name, r.title AS role_title, d.name AS department_name, r.salary
      FROM employees e
      INNER JOIN roles r ON e.role_id = r.id
      INNER JOIN departments d ON r.department_id = d.id
      WHERE d.id = ?
    `, department_id);

    console.table(employeesRows);
  } catch (err) {
    console.log(err);
  }

  mainMenu();
};



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
        'View employee by manager',
        'View employee by department',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update an employee role',
        'Update employee manager',
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
    case 'View employee by manager': viewEmployeeManager();
      break
    case 'View employee by department': viewEmployeeDepartment();
      break
    case 'Add a department': addDepartment();
      break;
    case 'Add a role': addRole()
      break;
    case 'Add an employee': addEmployee();
      break;
    case 'Update an employee role': updateEmployee();
      break;
    case 'Update employee manager': updateManager();
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
