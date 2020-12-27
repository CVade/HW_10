const util = require("util")
const mysql = require("mysql")
const { connect } = require("http2")

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "employees"
})

connection.connect()

connection.query = util.promisify(connection.query)

module.exports = connection