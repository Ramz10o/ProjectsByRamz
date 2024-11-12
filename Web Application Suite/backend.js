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
                username: user.username
            });
            await Login.save();
            console.log('Login Successful');
            return res.status(200).json({user : user.username});
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

app.post('/logout', async (req,res) => {
    try{
        const user = await Logins.findOne({ username : req.body.username });
        if(!user){
            return res.status(200).json({ message: 'Login not found' });
        }
        await Logins.deleteOne({ username : req.body.username });
        return res.status(200).json({});
    }catch(error){
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
})

app.post('/valid', async(req,res) => {
    try{
        const user = await Logins.findOne({ username : req.body.username });
        if(!user){
            return res.status(400);
        }
        return res.status(200)
    } catch(error){
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
})

async function findone(schema, condition = {}) {
    try {
        let res = await schema.findOne(condition);
        return res;
    } catch (error) {
        console.error('Error finding one:', error);
        throw error; 
    }
}

async function findoneupdate(schema, condition, update) {
    try {
        await schema.findOneAndUpdate(condition, update);
    } catch (error) {
        console.error('Error updating document:', error);
        throw error; 
    }
}

async function save(obj) {
    try {
        await obj.save();
    } catch (error) {
        console.error('Error saving document:', error);
        throw error; 
    }
}

async function find(schema, condition = {}) {
    try {
        let res = await schema.find(condition);
        return res;
    } catch (error) {
        console.error('Error finding documents:', error);
        throw error; 
    }
}

async function findchats(schema, condition = {}) {
    try {
        let res = await schema.find(condition).sort('time');
        return res;
    } catch (error) {
        console.error('Error finding documents:', error);
        throw error; 
    }
}

async function findonedel(schema, condition = {}) {
    try {
        await schema.findOneAndDelete(condition);
    } catch (error) {
        console.error('Error deleting document:', error);
        throw error; 
    }
}

io.on('connection', (socket) => {
    console.log('Client connected', socket.id);

    socket.on('details', async (data) => { 
        console.log('init');

        const existing = await findone(Sockets, { username: data.user }); 
        if (existing) {
            console.log('Existing socket');
            await findoneupdate(Sockets, { username: data.user }, { socketId: socket.id }); 
        } else {
            console.log('New socket');
            const sock = new Sockets({
                socketId: socket.id,
                username: data.user,
            });
            await save(sock); 
        }

        const activeUsers = await find(Sockets); 
        const users = await find(Users); 
        console.log('fetch Users');

        socket.broadcast.emit('online', { active: activeUsers, users: users });
        socket.emit('online', { active: activeUsers, users: users });
    });

    socket.on('send_message', async(data) => {
        console.log('send_message');
        const chats = new Chats({
            from : data.from,
            to : data.to,
            message : data.message,
            type : data.type
        });
        await save(chats);
        const to = await findone(Sockets, { username: data.to });
        if(to){
            socket.to(to.socketId).emit('get_message', data);
        }
    });

    socket.on('get_message', async (data) => {
        console.log('get_message');
        const chats = await findchats(Chats, { $or: [{ from: data.from, to: data.to },{ from: data.to, to: data.from }]});
        socket.emit('get_message', chats);
    })

    socket.on('disconnect', async () => { 
        await findonedel(Sockets, { socketId: socket.id }); 
        console.log('Client disconnected');

        const activeUsers = await find(Sockets); 
        const users = await find(Users); 

        socket.broadcast.emit('online', { active: activeUsers, users: users });
    });
});
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
