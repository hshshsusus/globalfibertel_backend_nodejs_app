const mysql = require("mysql2");
const dotenv = require("dotenv");

dotenv.config();

const connection = mysql.createConnection({
    host: "localhost",
    user: process.env.SQL_USERNAME,
    password: process.env.SQL_USERNAME,
    database: "homepagedata"
});

connection.connect(err => {
    if (err) {
        console.log(err, "connaction failed")
    } else {
        console.log("connected")
    }
})

module.exports = connection;