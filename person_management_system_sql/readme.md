# Person Management System

A secure, web-based Person Management System for managing personal records efficiently. Built with Node.js, Express.js, and MySQL, this project allows a single admin to add, view, search, and delete records, while ensuring data integrity and secure authentication.

---

![Node.js](https://img.shields.io/badge/Node.js-v18-green) 
![Express.js](https://img.shields.io/badge/Express.js-v4.18-blue) 
![MySQL](https://img.shields.io/badge/MySQL-v8-lightgrey)

---

## Table of Contents

- [Features](#features)  
- [Technologies Used](#technologies-used)  
- [System Architecture](#system-architecture)  
- [Database Design](#database-design)  
- [Installation](#installation)  
- [Usage](#usage)  
- [API Endpoints](#api-endpoints)  
- [Future Enhancements](#future-enhancements)  
- [License](#license)  

---

## Features

- **Single Admin Login**: Only one admin can log in and manage records.  
- CRUD Operations: Add, search, view, and delete personal records.  
- Secure Authentication: Passwords hashed using bcrypt; session states stored in the database.  
- Dynamic Web Interface: HTML, CSS, and JavaScript front end with interactive tables and forms.  
- Data Integrity: Unique constraints on email and phone number prevent duplicate entries.  
- Profile Pictures: Stored in base64 format.

---

## Technologies Used

- Backend: Node.js, Express.js  
- Frontend: HTML, CSS, JavaScript  
- Database: MySQL  
- Libraries: bcryptjs, body-parser, cors, multer, mysql2  

---

## System Architecture

This is a full-stack web application:  
- Frontend: Provides forms and tables to interact with the system.  
- Backend: Handles RESTful API requests, authentication, validation, and database communication.  
- Database: MySQL stores admin credentials, session states, and personal records securely.

---

## Database Design

Login Table
| Column     | Type    | Description               |
|------------|---------|---------------------------|
| isLoggedIn | BOOLEAN | Tracks admin session      |
| name       | VARCHAR | Admin name                |
| email      | VARCHAR | Admin email (PRIMARY KEY) |
| password   | VARCHAR | Hashed password           |

Records Table
| Column        | Type     | Description                    |
|---------------|----------|--------------------------------|
| id            | INT      | Auto-incremented record ID     |
| name          | VARCHAR  | Person name                    |
| dob           | DATE     | Date of Birth                  |
| email         | VARCHAR  | Email (UNIQUE)                 |
| phone         | VARCHAR  | Phone number (UNIQUE)          |
| pic_data      | LONGTEXT | Base64 encoded profile picture |
| pic_extension | VARCHAR  | Image MIME type                |

---

## Installation

1. Clone the repository:  

   git clone <repository_url>

2. Navigate to the project folder:

   cd person_management_system_sql

3. Install dependencies:

   npm install

4. Configure MySQL:

 - Create a database named person_management_system.
 - Update db.js with your database credentials.

5. Start the server:

   node JsFiles/backend.js

---

## Usage

1. Login: Use default credentials (Admin / Admin).

2. Add Person: Fill out the form with name, DOB, email, phone, and profile picture.

3. Search Records: Search by name, DOB, email, or phone.

4. Show Records: View all records in a sortable table.

5. Delete Record: Remove records directly from the table.

---

## API Endpoints

| End Point        | Method   | Description                        |
|------------------|----------|------------------------------------|
| /login           |  POST    | Authenticate admin login           |
| /logout          |  POST    | Logout admin                       |
| /addRecords      |  POST    | Add a new person record            |
| /getRecords      |  POST    | Retrieve all records (sortable)    |            
| /deleteRecords   |  POST    | Delete a record by email           |
| /find            |  POST    | Search records by multiple fields  |
| /valid           |  POST    | Verify admin session               |

---

## Future Enhancements

- Multi-admin support with role-based access.

- Pagination and filtering for large datasets.

- Profile picture upload with resizing and optimization.

- Dashboard analytics with charts and visualizations.

---

## License

MIT License

Author: Ramz P

Year: 2024
