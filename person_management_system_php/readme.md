# Person Management System

A secure, web-based Person Management System for managing personal records efficiently. Built with Node.js, Express.js, and MySQL, this project allows a single admin to add, view, search, and delete records, while ensuring data integrity and secure authentication.

---

![PHP](https://img.shields.io/badge/PHP-v8.2-blue) 
![MySQL](https://img.shields.io/badge/MySQL-v8-lightgrey) 
![HTML](https://img.shields.io/badge/HTML5-orange) 
![CSS](https://img.shields.io/badge/CSS3-blue)  

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

- **Single Admin Login:** Only one admin can log in and manage records.  
- **CRUD Operations:** Add, search, view, and delete personal records.  
- **Secure Authentication:** Passwords hashed using bcrypt; session states stored in the database.  
- **Dynamic Web Interface:** HTML, CSS, and JavaScript front end with interactive tables and forms.  
- **Data Integrity:** Unique constraints on email and phone number prevent duplicate entries.  
- **Profile Pictures:** Stored in base64 format.

---

## Technologies Used

- **Backend:** PHP 8.x  
- **Frontend:** HTML, CSS, JavaScript, jQuery  
- **Database:** MySQL  
- **Libraries:** jQuery, AJAX, 

---

## System Architecture

- **Frontend:** Provides forms and tables to interact with the system.  
- **Backend:** PHP scripts handle requests, authentication, validation, and database operations.  
- **Database:** MySQL stores admin credentials, session states, and personal records securely. 

---

## Database Design

**Login Table**

| Column     | Type    | Description               |
|------------|---------|---------------------------|
| isLoggedIn | BOOLEAN | Tracks admin session      |
| name       | VARCHAR | Admin name                |
| email      | VARCHAR | Admin email (PRIMARY KEY) |
| password   | VARCHAR | Hashed password           |

**Records Table**

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

2. Move project folder to your PHP server directory (e.g., htdocs for XAMPP).

3. Configure MySQL:

 - Create a database named person_management_system.
 - Import the provided SQL schema if available.
 - Update database credentials in db.php or equivalent config file.

4. Start your local server (e.g., XAMPP, WAMP, or MAMP).

5. Access the project via browser:

   http://localhost/person_management_system/
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

- Export records to CSV or PDF.

---

## License

MIT License

Authors: Ramz P, Preetham Pradhan

Year: 2024
