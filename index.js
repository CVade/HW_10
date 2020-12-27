const {prompt} = require("inquirer")
const logo = require("asciiart-logo")
const db = require("./db")
const { createDepartment } = require("./db")
require("console.table")
init()

function init() {
    const logoText = logo({name: "employee manager"}).render()
    console.log(logoText)
    loadPrompts()
}

async function loadPrompts() {
    const {choice} = await prompt([{
        type: "list",
        name: "choice",
        message: "What would you like to do?",
        choices: [{
            name: "View all employees",
            value: "VIEW_EMPLOYEES"
        },
        {
            name: "View all employees by department",
            value: "VIEW_EMPLOYEES_BY_DEPARTMENT"
        },
        {
            name: "View all employees by manager",
            value: "VIEW_ALL_EMPLOYEES_BY_MANAGER"
        },
        {
            name: "Add employee",
            value: "ADD_EMPLOYEE"
        },
        {
            name: "Delete employee",
            value: "DELETE_EMPLOYEE"
        },
        {
            name: "Update employee role",
            value: "UPDATE_EMPLOYEE_ROLE"
        },
        {
            name: "Update employee manager",
            value: "UPDATE_EMPLOYEE_MANAGER"
        },
        {
            name: "View all roles",
            value: "VIEW_ALL_ROLES"
        },
        {
            name: "Add role",
            value: "ADD_ROLE"
        },
        {
            name: "Delete role",
            value: "DELETE_ROLE"
        },
        {
            name: "View all departments",
            value: "VIEW_ALL_DEPARTMENTS"
        },
        {
            name: "Add department",
            value: "ADD_DEPARTMENT"
        },
        {
            name: "Delete department",
            value: "DELETE_DEPARTMENT"
        },
        {
            name: "Quit",
            value: "QUIT"
        }
    ]
    }])

    switch (choice) {
        case "VIEW_EMPLOYEES": return viewEmployees();
        case "VIEW_EMPLOYEES_BY_DEPARTMENT": return viewEmployeesByDepartment();
        case "VIEW_EMPLOYEES_BY_MANAGER": return viewEmployeesByManager();
        case "ADD_EMPLOYEE": return addEmployee();
        case "DELETE_EMPLOYEE": return deleteEmployee();
        case "UPDATE_EMPLOYEE_ROLE": return updateEmployeeRole();
        case "UPDATE_EMPLOYEE_MANAGER": return updateEmployeeManager();
        case "VIEW_ALL_ROLES": return viewAllRoles();
        case "ADD_ROLE": return addRole();
        case "DELETE_ROLE": return deleteRole();
        case "VIEW_ALL_DEPARTMENTS": return viewAllDepartments();
        case "ADD_DEPARTMENT": return addDepartment();
        case "DELETE_DEPARTMENT": return deleteDepartment();
        case "QUIT": return quit();
    }

    async function viewEmployees() {
        const employees = await db.findAllEmployees()
        console.log("\n")
        console.table(employees)
        loadPrompts()
    }
    async function viewEmployeesByDepartment() {
        const departments = await db.findAllDepartments()
        const departmentChoices = departments.map(({id, name}) => ({name: name, value: id}))
        const {departmentID} = await prompt([{
            type: "list",
            name: "departmentID",
            message: "Which departments' employees would you like to see?",
            choices: departmentChoices
        }])
        const employees = await db.findAllEmployeesByDepartment(departmentID)
        console.log("\n")
        console.table(employees)
        loadPrompts()
    }
    async function viewEmployeesByManager() {
        const managers = await db.findAllManagers()
        const managerChoices = managers.map(({id, first_name, last_name}) => ({name: `${first_name} ${last_name}`, value: id}))
        const {managerID} = await prompt([{
            type: "list",
            name: "managerID",
            message: "Which managers' employees would you like to see?",
            choices: managerChoices
        }])
        const employees = await db.findAllEmployeesByManager(managerID)
        console.log("\n")
        console.table(employees)
        loadPrompts()
    }
    async function addEmployee() {
        const roles = await db.findAllRoles()
        const employees = await db.findAllEmployees()
        const employee = await prompt([{
            name: "first_name",
            message: "Employee's first name?"
        },
        {
            name: "last_name",
            message: "Employee's last name?"
        }])
        const roleChoices = roles.map(({id, title}) => ({name: title, value: id}))
        const {roleID} = await prompt([{
            type: "list",
            name: "roleID",
            message: "What employee's role?",
            choices: roleChoices
        }])
        employee.role_id = roleID;
        const managerChoices = managers.map(({id, first_name, last_name}) => ({name: `${first_name} ${last_name}`, value: id}))
        const {managerID} = await prompt([{
            type: "list",
            name: "managerID",
            message: "Employee's manager?",
            choices: managerChoices
        }])
        employee.manager_id = managerID;
        await db.createEmployee(employee)
        console.log(`added ${employee.first_name} ${employee.last_name}`)
        loadPrompts()
    }
    async function deleteEmployee() {
        const employees = await db.findAllEmployees()
        const employeeChoices = employees.map(({id, first_name, last_name}) => ({name: `${first_name} ${last_name}`, value: id}))
        const {employeeID} = await prompt([{
            type: "list",
            name: "employeeID",
            message: "Which employee will be deleted?",
            choices: employeeChoices
        }])
        await db.deleteEmployee(employeeID)
        console.log("Deleted employee")
        loadPrompts()
    }
    async function updateEmployeeRole() {
        const employees = await db.findAllEmployees()
        const employeeChoices = employees.map(({id, first_name, last_name}) => ({name: `${first_name} ${last_name}`, value: id}))
        const {employeeID} = await prompt([{
            type: "list",
            name: "employeeID",
            message: "Which employee will be updated?",
            choices: employeeChoices
        }])
        const roles = await db.findAllRoles()
        const roleChoices = roles.map(({id, title}) => ({name: title, value: id}))
        const {roleID} = await prompt([{
            type: "list",
            name: "roleID",
            message: "Which role will be updated?",
            choices: roleChoices
        }])
        await db.updateEmployeeRole(employeeID, roleID)
        console.log("Updated employee's role.")
        loadPrompts()
    }
    async function updateEmployeeManager() {
        const employees = await db.findAllEmployees()
        const employeeChoices = employees.map(({id, first_name, last_name}) => ({name: `${first_name} ${last_name}`, value: id}))
        const {employeeID} = await prompt([{
            type: "list",
            name: "employeeID",
            message: "Which employee's manager will be updated?",
            choices: employeeChoices
        }])
        const managers = await db.findAllExceptEmployee(employeeID)
        const managerChoices = managers.map(({id, first_name, last_name}) => ({name: `${first_name} ${last_name}`, value: id}))
        const {managerID} = await prompt([{
            type: "list",
            name: "managerID",
            message: "Which manager for this employee?",
            choices: managerChoices
        }])
        await db.updateEmployeeManager(employeeID, managerID)
        console.log("Updated employee's manager.")
        loadPrompts()
    }
    async function viewAllRoles() {
        const roles = await db.findAllRoles()
        console.log("\n")
        console.table(roles)
        loadPrompts()
    }
    async function addRole() {
        const departments = await db.findAllDepartments()
        const departmentChoices = departments.map(({id, name}) => ({name: name, value: id}))
        const role = await prompt([{
            name: "title",
            message: "Name of role?"
        },
        {
            name: "salary",
            message: "Salary of role?"
        },
        {
            type: "list",
            name: "department_id",
            message: "Roles' department?",
            choices: departmentChoices
        }])
        await db.createRole(role)
        console.log(`added ${role.title}`)
        loadPrompts()
    }
    async function deleteRole() {
        const roles = await db.findAllRoles()
        const roleChoices = roles.map(({id, title}) => ({name: title, value: id}))
        const {roleID} = await prompt([{
            type: "list",
            name: "roleID",
            message: "Which role will be deleted?",
            choices: roleChoices
        }])
        await db.deleteRole(roleID)
        console.log("Deleted role")
        loadPrompts()
    }
    async function viewAllDepartments() {
        const departments = await db.findAllDepartments()
        console.log("\n")
        console.table(departments)
        loadPrompts()
    }
    async function addDepartment() {
        const department = await prompt([{name: "name", message: "new department name?"}])
        await db.createDepartment(department)
        console.log(`added ${department.name}`)
        loadPrompts()
    }
    async function deleteDepartment() {
        const departments = await db.findAllDepartments()
        const departmentChoices = departments.map(({id, name}) => ({name: name, value: id}))
        const {departmentID} = await prompt([{
            type: "list",
            name: "departmentID",
            message: "Which department will be deleted?",
            choices: departmentChoices
        }])
        await db.deleteDepartment(departmentID)
        console.log("Deleted department")
        loadPrompts()
    }
    function quit() {
        console.log("Thanks for using!")
        process.exit()
    }
}