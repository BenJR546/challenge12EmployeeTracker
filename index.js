// Install required dependencies: inquirer, pg, console.table
// npm install inquirer pg console.table

const inquirer = require("inquirer");
const { Client } = require("pg");
require("console.table");

const client = new Client({
    user: "postgres",
    host: "localhost",
    database: "employee_db",
    password: "password",
    port: 5432,
});

client
    .connect()
    .then(() => {
        console.log("Connected to the database.");
    })
    .catch((err) => {
        console.error("Failed to connect to the database:", err);
        process.exit(1);
    });

const startApp = async () => {
    const { action } = await inquirer.prompt({
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: [
            "View all departments",
            "View all roles",
            "View all employees",
            "Add a department",
            "Add a role",
            "Add an employee",
            "Update an employee role",
            "Add a manager",
            "Exit",
        ],
    });

    switch (action) {
        case "View all departments":
            await viewDepartments();
            break;
        case "View all roles":
            await viewRoles();
            break;
        case "View all employees":
            await viewEmployees();
            break;
        case "Add a department":
            await addDepartment();
            break;
        case "Add a role":
            await addRole();
            break;
        case "Add an employee":
            await addEmployee();
            break;
        case "Update an employee role":
            await updateEmployeeRole();
            break;
        case "Add a manager":
            await addManager();
            break;
        case "Exit":
            await client
                .end()
                .then(() => {
                    console.log("Disconnected from the database.");
                })
                .catch((err) => {
                    console.error("Error during disconnection:", err);
                });
            return;
    }

    startApp().catch((err) => {
        console.error("Unexpected error:", err);
        client.end();
    });
};

const viewDepartments = async () => {
    try {
        const res = await client.query("SELECT * FROM department");
        console.table(res.rows);
    } catch (err) {
        console.error("Error viewing departments:", err);
    }
};

const viewRoles = async () => {
    try {
        const res = await client.query(`
      SELECT role.id, role.title, role.salary, department.name AS department
      FROM role
      JOIN department ON role.department_id = department.id
    `);
        console.table(res.rows);
    } catch (err) {
        console.error("Error viewing roles:", err);
    }
};

const viewEmployees = async () => {
    try {
        const res = await client.query(`
      SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, 
      CONCAT(manager.first_name, ' ', manager.last_name) AS manager
      FROM employee
      JOIN role ON employee.role_id = role.id
      JOIN department ON role.department_id = department.id
      LEFT JOIN employee AS manager ON employee.manager_id = manager.id
    `);
        console.table(res.rows);
    } catch (err) {
        console.error("Error viewing employees:", err);
    }
};

const addDepartment = async () => {
    try {
        const { name } = await inquirer.prompt({
            type: "input",
            name: "name",
            message: "Enter the department name:",
        });
        await client.query("INSERT INTO department (name) VALUES ($1)", [name]);
        console.log(`Added department: ${name}`);
    } catch (err) {
        console.error("Error adding department:", err);
    }
};

const addRole = async () => {
    try {
        const departmentsRes = await client.query(
            "SELECT id, name FROM department"
        );
        const departmentChoices = departmentsRes.rows.map((dept) => ({
            name: dept.name,
            value: dept.id,
        }));
        const { title, salary, department_id } = await inquirer.prompt([
            { type: "input", name: "title", message: "Enter the role title:" },
            {
                type: "input",
                name: "salary",
                message: "Enter the role salary:",
            },
            {
                type: "list",
                name: "department_id",
                message: "Select the department for the role:",
                choices: departmentChoices,
            },
        ]);
        await client.query(
            "INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)",
            [title, salary, department_id]
        );
        console.log(`Added role: ${title}`);
    } catch (err) {
        console.error("Error adding role:", err);
    }
};

const addEmployee = async () => {
    try {
        const rolesRes = await client.query("SELECT id, title FROM role");
        if (rolesRes.rows.length === 0) {
            console.log("No roles available. Please add a role first.");
            return;
        }
        const roleChoices = rolesRes.rows.map((role) => ({
            name: role.title,
            value: role.id,
        }));
        const employeesRes = await client.query(
            "SELECT id, first_name, last_name FROM employee"
        );
        const managerChoices = employeesRes.rows.map((emp) => ({
            name: `${emp.first_name} ${emp.last_name}`,
            value: emp.id,
        }));
        const { first_name, last_name, role_id, manager_id } =
            await inquirer.prompt([
                {
                    type: "input",
                    name: "first_name",
                    message: "Enter the employee's first name:",
                },
                {
                    type: "input",
                    name: "last_name",
                    message: "Enter the employee's last name:",
                },
                {
                    type: "list",
                    name: "role_id",
                    message: "Select the role for the employee:",
                    choices: roleChoices,
                },
                {
                    type: "list",
                    name: "manager_id",
                    message:
                        "Select the manager for the employee (or select 'None'):",
                    choices: [...managerChoices, { name: "None", value: null }],
                },
            ]);
        const managerIdValue = manager_id ? manager_id : null;
        await client.query(
            "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)",
            [first_name, last_name, role_id, managerIdValue]
        );
        console.log(`Added employee: ${first_name} ${last_name}`);
    } catch (err) {
        console.error("Error adding employee:", err);
    }
};

const addManager = async () => {
    try {
        const rolesRes = await client.query("SELECT id, title FROM role");
        if (rolesRes.rows.length === 0) {
            console.log("No roles available. Please add a role first.");
            return;
        }
        const roleChoices = rolesRes.rows.map((role) => ({
            name: role.title,
            value: role.id,
        }));
        const { first_name, last_name, role_id } = await inquirer.prompt([
            {
                type: "input",
                name: "first_name",
                message: "Enter the manager's first name:",
            },
            {
                type: "input",
                name: "last_name",
                message: "Enter the manager's last name:",
            },
            {
                type: "list",
                name: "role_id",
                message: "Select the role for the manager:",
                choices: roleChoices,
            },
        ]);
        await client.query(
            "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, NULL)",
            [first_name, last_name, role_id]
        );
        console.log(`Added manager: ${first_name} ${last_name}`);
    } catch (err) {
        console.error("Error adding manager:", err);
    }
};

const updateEmployeeRole = async () => {
    try {
        const employeesRes = await client.query(
            "SELECT id, first_name, last_name FROM employee"
        );
        const employeeChoices = employeesRes.rows.map((emp) => ({
            name: `${emp.first_name} ${emp.last_name}`,
            value: emp.id,
        }));
        const rolesRes = await client.query("SELECT id, title FROM role");
        const roleChoices = rolesRes.rows.map((role) => ({
            name: role.title,
            value: role.id,
        }));
        const { employee_id, role_id } = await inquirer.prompt([
            {
                type: "list",
                name: "employee_id",
                message: "Select the employee to update:",
                choices: employeeChoices,
            },
            {
                type: "list",
                name: "role_id",
                message: "Select the new role for the employee:",
                choices: roleChoices,
            },
        ]);
        await client.query("UPDATE employee SET role_id = $1 WHERE id = $2", [
            role_id,
            employee_id,
        ]);
        console.log(`Updated employee ID ${employee_id} to role ID ${role_id}`);
    } catch (err) {
        console.error("Error updating employee role:", err);
    }
};

startApp();
