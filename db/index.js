const connection = require("./connection")

class DB {
    constructor(connection) {this.connection = connection}

    findAllEmployees() {
        return this.connection.query("SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;")
    }

    findAllExceptEmployee(employeeID) {
        return this.connection.query("SELECT id, first_name, last_name FROM employee WHERE id != ?", employeeID)
    }

    createEmployee(employee) {
        return this.connection.query("INSERT INTO employee SET ?", employee)
    }

    deleteEmployee(employeeID) {
        return this.connection.query("DELETE FROM employee WHERE id = ?", employeeID)
    }

    updateEmployeeRole(employeeID, roleID) {
        return this.connection.query("UPDATE employee SET role_id = ? WHERE id = ?", [roleID, employeeID])
    }

    updateEmployeeManager(employeeID, managerID) {
        return this.connection.query("UPDATE employee SET manager_id = ? WHERE id = ?", [managerID, employeeID])
    }

    findAllRoles() {
        return this.connection.query("SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department on role.department_id = department.id;")
    }

    createRole(role) {
        return this.connection.query("INSERT INTO role SET ?", role)
    }

    deleteRole(roleID) {
        return this.connection.query("DELETE FROM role WHERE id = ?", roleID)
    }

    findAllDepartments() {
        return this.connection.query("SELECT department.id, department.name, SUM(role.salary) AS utilized_budget FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id GROUP BY department.id, department.name;")
    }

    createDepartment(department) {
        return this.connection.query("INSERT INTO department SET ?", department)
    }

    deleteDepartment(departmentID) {
        return this.connection.query("DELETE FROM department WHERE id = ?", departmentID)
    }

    findAllEmployeesByDepartment(departmentID) {
        return this.connection.query("SELECT employee.id, employee.first_name, employee.last_name, role.title FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id WHERE department.id = ?", departmentID)
    }
    
    findAllEmployeesByManager(managerID) {
        return this.connection.query("SELECT employee.id, employee.first_name, employee.last_name, department.name AS department, role.title FROM employee LEFT JOIN role on role.id = employee.role_id LEFT JOIN department on department.id = role.department_id WHERE manager_id = ?", managerID)
    }
}

module.exports = new DB(connection)