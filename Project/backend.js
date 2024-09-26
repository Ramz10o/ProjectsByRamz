// backend.js

const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const multer = require('multer');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

app.use(session({
    secret: 'Devara', 
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false } 
}));

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/UserData", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));
    
// Create a model
const User = mongoose.model('User', new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
}), 'Credentials');

// Handle incoming requests for signup and login
app.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        console.log('Sign Up attempt');
        const existingUser = await User.findOne({ email : email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password before saving it
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({ name : username, email : email, password : hashedPassword })

        // Insert new record
        await user.save();
        console.log('Sign Up Successful');
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

let username = '', login = false, msg = '';

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        console.log('Login attempt');
        const user = await User.findOne({ email : email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Compare the password with the hashed password stored in the database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        req.session.username = user.name;
        req.session.isLoggedIn = true;
        username = user.name; login = true;
        console.log(req.session.username);
        // If the password is correct, return a JWT token
        const token = jwt.sign({ userId: user._id }, 'CODM is best mobile fps game',{ expiresIn: '1h' });
        console.log('Login Successful');
        return res.status(200).json({ message : 'Login Successful',token });


    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Server error' });
    }
});

app.post('/valid', (req,res) => {
    try{
        if (!login) {
            return res.status(400).json({ message : 'Authentication error Login again' });
        } else {
            if(msg === ''){
                msg = 'Welcome';
                return res.status(200).json({ message : `Welcome ${username}` });
            }
        }
    }catch (error){
        console.error(error);
        return res.status(500).json({ message : 'Server error' });
    }
});

const Record = mongoose.model('Record', new mongoose.Schema({
    username : {type : String, required: true},
    name : {type : String, required: true},
    dob : {type : Date, required: true},
    email : {type : String, required: true},
    phone : {type : String, required: true},
    pic : {type : Buffer, required: true},
    extension : {type : String, required: true}
}));

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 2 * 1024 * 1024 // Limit to 5MB
    },
    fileFilter: (req, file, cb) => {
        // Accept only image files
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    }
});


app.post('/addRecord', upload.single('pic'), async (req,res) => {
    const {name, dob, email, phone} = req.body;
    try{
        if (!req.file) {
            return res.status(400).json({ message : 'No file uploaded.' });
        }
        console.log(req.session.username);
        console.log(req.file);
        const details = new Record({ username : username, name : name, dob :  dob, email : email, phone : phone, 
            pic : req.file.buffer, extension : req.file.mimetype});
    await details.save();
    return res.status(200).json({ message : 'Insertion successful' });
    }
    catch(error){
        if (error instanceof multer.MulterError) {
            if(error.code === 'LIMIT_FILE_SIZE'){
                return res.status(400).json({ message : 'Pic size exceed 2 MB' });
            }
            return res.status(400).json({ message : error.message });
        }
        console.error(error);
        res.status(500).json({ mesage : 'Error uploading details' });
    }
});

app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: 'Could not log out' });
        }
        login = false; username = '', msg = '';
        res.status(200).json({ message: 'Logout successful' });
    });
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});