const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const { Server } = require("socket.io");
const http = require('http');
const multer = require('multer');
const cors = require('cors');
const { Users, Logins, Sockets, Chats, Leaderboard } = require('./models');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true 
    }
});
const PORT = 5000;
const URI = 'mongodb+srv://ramz:bM0cFn3cdNa7yLfE@cluster0.eupad.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('Web Application Suite'));

mongoose.connect(URI, { dbName : 'SuiteDataBase' }, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

app.post('/login', async (req, res) => {
        const { email, password } = req.body;
        try {
            console.log('Login attempt');
            const user = await Users.findOne({ email : email });
            if (!user) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }
            const Login = new Logins({
                user: user._id
            });
            await Login.save();
            console.log('Login Successful');
            return res.status(200).json({user : user._id});
        } catch (error) {
            console.error(error)
            return res.status(500).json({ message: 'Server error' });
        }
});

app.post('/signup', async (req,res) => {
    const { email, password, username } = req.body;
    try{
        const existingUser = await Users.findOne({ username : username.toLowerCase() });
        if(existingUser){
            return res.status(400).json({ message: 'User Name already in use' });
        }
        const existingEmail = await Users.findOne({ email : email });
        if(existingEmail){
            return res.status(400).json({ message: 'Email already in use' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new Users({
            email: email,
            password: hashedPassword,
            username: username.toLowerCase()
        });
        await user.save();
        console.log('User created');
        return res.status(200).json({});
        } 
        catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server error' });
        }
});

io.on('connection', (socket) => {
    console.log('Client connected',socket.id);
    socket.on('details', async (data) => {
        const existing = Sockets.findOne({user : data.user});
        if(existing){
            await Sockets.findOneAndUpdate({user : data.user},{ socket : socket.id});
        }
        else{
            const sock = new Sockets({
                socket: socket.id,
                user: data.user,
                app: data.app
              });
              await sock.save();
        }
          const activeUsers = Sockets.find({app : data.app});
          socket.broadcast.emit('Online',activeUsers);
          socket.to(socket.id).emit('Online',activeUsers);
    });
    socket.on('send_message', async (msg) => {
        const to = Users.findOne({ username : msg.to });
        const chat = new Chats({
            from: msg.from,
            to: to._id,
            message: msg.type === 'text' ? msg.message : Buffer.from(msg.message).toString('base64'),
            type: msg.type
        });
        await chat.save();
        const chats = Chats.find( {$or : [{ from : msg.from, to : to._id},{from : to._id, to : msg.from}] }).sort('time');
        socket.to(socket.id).emit('get_message', chats);
        const toSocket = await Sockets.findOne({ user:to._id , app:'Chatzz'});
        if(toSocket){
            socket.to(toSocket.socket).emit('get_message', chats);
        }
    });
    socket.on('get_message', async (msg) => {
        const to = Users.findOne({ username : msg.to });
        const chats = Chats.find( {$or : [{ from : msg.from, to : to._id},{from : to._id, to : msg.from}] }).sort('time');
        socket.to(socket.id).emit('get_message', chats);
    })
    socket.on('invite', (from) => {
    });
    socket.on('accept', () => {
    });
    socket.on('reject', () => {
    });
    socket.on('play', (game) => {
    });
    socket.on('disconnect', () => {
        Sockets.findOneAndDelete({ socket:socket.id});
        console.log('Client disconnected');
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
