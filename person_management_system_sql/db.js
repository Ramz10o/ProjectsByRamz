const sql = require('mysql2');
const bcrypt = require('bcryptjs');

const email = 'Login Email Here';
const password = 'Login Password Here';

const db = sql.createConnection({
    host: 'DataBase Host Here',
    user: 'DataBase User Here',
    password: 'DataBase Password Here',
    database: 'person_management_system' // Create Database named "person_management_system" beforehand in mysql server
});

db.connect((err) => {
    if(err) throw err;
    console.log('DataBase Connected successfully');
});

db.query(`CREATE TABLE IF NOT EXISTS Login (
    isLoggedIn BOOLEAN NOT NULL DEFAULT FALSE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE PRIMARY KEY,
    password VARCHAR(255) NOT NULL )`,(err) => {
    if(err) throw err;
    console.log('Table Created  Successfully');
});

db.query(`CREATE TABLE IF NOT EXISTS Records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    dob DATE NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL UNIQUE,
    pic_data LONGTEXT NOT NULL, 
    pic_extension VARCHAR(50) NOT NULL )`,(err) => {
    if(err) throw err;
    console.log('Table Created  Successfully');
});

db.query('ALTER TABLE LOGIN AUTO_INCREMENT = 0',(err) => {
    if(err) throw err;
    console.log('Auto Increment set to 0');
});

db.query("INSERT INTO LOGIN VALUES (?, ?, ?, ?)", 
    [false, 'Admin', email, bcrypt.hashSync(password,10)], (err) => {
    if (err) throw err;
    console.log('Insertion Successful');
});
