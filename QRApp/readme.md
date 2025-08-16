
# QRApp

QRApp is a web-based QR Code Generator and Reader application built with **Flask**, **PostgreSQL**, **JavaScript**, and **OpenCV**.  
It allows users to register, log in securely, generate QR codes from text or other content, and scan/upload images to read QR codes.

---

![Python](https://img.shields.io/badge/Python-3.8+-blue)
![Flask](https://img.shields.io/badge/Flask-v2.3-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-v15-lightgrey)

---

## Table of Contents

- [Features](#features)  
- [Technologies Used](#technologies-used)  
- [System Architecture](#system-architecture)  
- [Database Design](#database-design)  
- [Installation & Setup](#installation--setup)  
- [Usage](#usage)  
- [API Endpoints](#api-endpoints)  
- [Future Enhancements](#future-enhancements)  
- [License](#license)  

---

## 🚀 Features
- **User Authentication**
  - Registration with hashed password storage
  - Secure login with JWT token-based authentication
- **QR Code Operations**
  - Generate QR codes from custom content
  - Read QR codes from uploaded images using OpenCV
- **Database Support**
  - PostgreSQL for storing user accounts and generated codes
- **Frontend**
  - Clean UI using HTML, CSS, and JavaScript
- **Security**
  - JWT tokens for session handling
  - Passwords stored with hashing (`werkzeug.security`)

---

## 🛠 Technologies Used
- Python 3.8+
- Flask
- PostgreSQL
- JavaScript (ES6)
- HTML & CSS
- OpenCV & Pillow
- qrcode library
- JWT for authentication

---

## 📂 System Architecture
- **Frontend:** HTML templates + JS scripts for interaction  
- **Backend:** Flask API handling authentication, QR code generation, and QR code reading  
- **Database:** PostgreSQL storing Users and QR Codes  

---

## 🗄 Database Design

**Tables:**

1. **Users**

| Column   | Type         | Constraints            |
|----------|--------------|------------------------|
| id       | SERIAL       | PRIMARY KEY            |
| username | VARCHAR(255) | NOT NULL               |
| email    | VARCHAR(255) | NOT NULL, UNIQUE       |
| password | VARCHAR(255) | NOT NULL               |

2. **Codes**

| Column  | Type         | Constraints  |
|---------|--------------|--------------|
| email   | VARCHAR(255) | PRIMARY KEY  |
| content | VARCHAR(255) | NOT NULL     |

---

## ⚙️ Installation & Setup

### Prerequisites
- Python 3.8+
- PostgreSQL
- pip

###  Steps
1. Clone the repository:

   - git clone https://github.com/your-username/QRApp.git
   -  cd QRApp

2. Install dependencies:

   pip install flask flask-cors psycopg2 qrcode opencv-python pillow pyjwt werkzeug

3. Configure PostgreSQL:

   - Create a database named Demo
   - Update backend.py connection credentials:

   return psycopg2.connect(
    host='localhost',
    database='Demo',
    user='postgres',
    password='123456')

4. Run the application:

   python backend.py

5. Open in your browser:

   http://127.0.0.1:5000/

---

## 💻 Usage

1. Landing page (/) → choose Login or Register.

2. Register a new account or login with existing credentials.

3. After login → redirected to home page (/home) with options:

   - Generate QR

   - Read QR

   - Logout

4. Generate QR → enter content and email → QR image displayed + download link.

5. Read QR → upload image → decoded data displayed.

---

## 🔗 API Endpoints

| End Point        | Method   | Description                              |
|------------------|----------|------------------------------------------|
| /auth/register   |  POST    | Registers a new user.                    |
| /auth/login      |  POST    | Logs in a user and returns a JWT token.  |
| /qr/generate     |  POST    | Generate a QR code.                      |
| /qr/read         |  POST    | Read a QR code from an uploaded image.   |            

---

## 🌟 Future Enhancements

   - Add QR code history for users

   - Extend token expiry handling

   - Mobile-friendly responsive UI

   - Export QR codes in different formats (SVG, PDF)

   - Add email verification during registration

---

## 📄 License

MIT License

Author: Ramz P

Year: 2024