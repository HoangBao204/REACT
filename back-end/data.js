var mysql = require('mysql');
var data = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Hieuxeom@123',
    port: 3306,
    database: 'asm1'
});
data.connect(err => {
    if (err) throw err;
    console.log('Connected successfully');
});
module.exports = data;