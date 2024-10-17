# Employee Tracker

## Description

The Employee tracker is a command-line application that allows users to manage a company's employee database using Node.js, Inquirer and PostgreSQL. This tool provides functionality to add departments, roles, employees and managers, as well as view and update employee information in a structured way.

## Features

-   View all departments, roles and employees
-   Add new departments, roles and employees
-   Add a manager to the system
-   Update an employee's role

## Technologies Used

-   **Node.js:** JavaScript runtime used for server-side development
-   **PostgreSQL:** Database used to store and manage employee data
-   **Inquirer:** Provides an interactive commanf-line interface for user input
-   **Console.table:** Used to display data in a table format
-   **Dotenv:** Used to store sensitive information such as database credentials

## Installation

1. Clone the repository to your local machine and navigate to the project directory:

```bash
git clone https://github.com/BenJR546/challenge12EmployeeTracker

cd challenge12EmployeeTracker
```

2. Install the required dependencies:

```bash
npm install
```

3. Set up the database:

```bash
psql -U {your_user}
```

You will be prompted to enter the password for the postgres user, then:

```bash
\i employee_db.sql
\q
```

**NOTE**: Running the SQL file will clear the existing database and create a new one. Do **NOT** run this command if you already have a database set up.

4. Create a `.env` file in the root directory and add your postgres credentials in the file:

```bash
USER=your_actual_user
PASSWORD=your_actual_password
```

## Usage

1. Run the application:

```bash
node index.js
```

2. You will be prompted with a list of actions to manage departments, roles, employees and more.

### Available Actions

-   **View all departments**: Displays a list of all departments.
-   **View all roles**: Displays a list of all roles with associated department and salary information.
-   **View All Employees**: Displays a list of all employees including their role, department, salary and manager.
-   **Add a Department**: Adds a new department to the database.
-   **Add a Role**: Adds a new role by selecting an existing department.
-   **Add an Employee**: Adds a new employee, allowing you to choose a role and a manager (if applicable).
-   **Add A Manager**: Adds a new manager to the system by selecting an appropriate role.
-   **Ipdate an Employee Role**: Updates an existing employee's role by selecting from available options.

## Dependencies

-   **Inquirer**: For interactive command-line prompts.
-   **pg**: PostgreSQL client for Node.js.
-   **Console.table**: For displaying data in a readable table format.
-   **Dotenv**: For managiing environment variables securely.

## License

This project is unlicensed and is not intended for commercial use. Please use it however you see fit.

## Contributing

Contributions are welcome! Please feel free to open a pull request or submit an issue.

## Contact

If you have any questions or need assistance, please contact me [by email](mailto:benjrice546@gmail.com) or on my [GitHub profile](https://github.com/BenJR546).
