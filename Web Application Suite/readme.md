# 🚀 Web Applications Suite


A **secure, web-based multi-app suite** featuring a **Scientific Calculator**, **Professional Notepad**, **Real-time Chat**, and **Tic Tac Toe Game** – all accessible from a single dashboard! 🎯  

Built using **HTML, CSS, JavaScript**, **Node.js**, **Express.js**, **Socket.io**, and **MongoDB** for real-time chat. Perfect for personal productivity, fun, and learning web development.

---

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=flat&logo=express&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=flat&logo=socket.io&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)

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

## ✨ Features

### 🏠 Dashboard (`AppPage.html`)
- Animated backdrop and hover effects.  
- Easy navigation to all apps.  
- Logout & Home buttons.  
- Interactive, visually appealing buttons with smooth transitions.  

### 🧮 Scientific Calculator (`Calculator.html`)
- Basic arithmetic: `+`, `-`, `*`, `/`.  
- Advanced functions: `sin()`, `cos()`, `tan()`, `log`, `exp()`, `x^y`, `√x`.  
- Clear (`C`) and equal (`=`) buttons.  
- Responsive UI with animated button feedback.  

### 📝 Professional Notepad (`notepad.html`)
- Create, open, and save `.txt` files locally.  
- Clean, minimalist interface.  
- Easy toolbar with New, Open, Save.  

### 💬 Real-time Chat (`chatz.html`)
- Powered by **Node.js + Express.js + Socket.io + MongoDB**.  
- Online/offline user status indicators.  
- Send text messages and images.  
- Dynamic contacts list & chat area.  

### 🎮 Tic Tac Toe (`TicTacToe.html`)
- Interactive 3x3 game grid.  
- Randomized first player.  
- Auto win/tie detection with color-coded X/O.  
- Reset button for a new game.  

---

## 🛠 Technologies Used
- **Front-end:** HTML5, CSS3, JavaScript, Boxicons, Google Fonts  
- **Back-end:** Node.js, Express.js  
- **Real-time Communication:** Socket.io  
- **Database:** MongoDB  
- **Other Tools:** VS Code, Modern Browsers  

---

## 🏗 System Architecture
- Client-server model.  
- Browser interacts with Node.js server via **Express routes**.  
- Real-time chat messages handled using **Socket.io**.  
- Chat messages persist in **MongoDB** database.  
- Dashboard serves as the centralized access point for all apps.  

---

## 💾 Database Design
- **MongoDB collections:**  
  - `users` – stores user credentials and profile info.  
  - `messages` – stores chat messages with `from`, `to`, `message`, `type`, and timestamp.  
- Supports online/offline status tracking.  

---

## ⚡ Installation
1. Clone or download the repository.

2. Navigate to project folder and run:
   
   npm install

3. Start server:

   node server.js

4. Open Login_page.html in a modern browser.

---

## 🚀 Usage

1. Login to the system (ensure session storage is used for user validation).

2. Access the dashboard to launch any app.

3. Use the calculator, notepad, chat, or tic-tac-toe as desired.

4. Real-time chat messages and images are synchronized across all connected clients.

---

## 🔗 API Endpoints

| End Point            | Method   | Description                     |
|----------------------|----------|---------------------------------|
| /login               |  POST    | Authenticate user.              |
| /regiter             |  POST    | Register new user.              |
| /users               |  GET     | Get all registered users.       |
| /messages            |  POST    | Send a chat message.            |
| /messages/:from/:to  |  GET     | Retrieve chat history.          |

---

## 🌟 Future Enhancements

- User authentication with JWT.

- File sharing beyond images (PDF, docx).

- Customizable themes for dashboard & apps.

- Multi-room chat support.

- Mobile responsive design improvements.

## License

MIT License

Author: Ramz P

Year: 2024
