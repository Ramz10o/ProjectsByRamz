const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const multer = require('multer');
const cors = require('cors');
const { Record, Logins, User } = require('./models/models');

const app = express();
const PORT = process.env.PORT || 5000;
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('uploads'));

mongoose.connect("mongodb://localhost:27017/UserData", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

app.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        console.log('Sign Up attempt');
        const existingUser = await User.findOne({ email : email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name : username, email : email, password : hashedPassword })
        await user.save();
        console.log('Sign Up Successful');
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});


app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        console.log('Login attempt');
        const user = await User.findOne({ email : email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const login = new Logins({ email : user.email, message : 'welcome' });
        await login.save();
        const token = jwt.sign({ userId: user._id }, 'CODM is best mobile fps game',{ expiresIn: '1h' });
        console.log('Login Successful');
        return res.status(200).json({ message : 'Login Successful', token, email : user.email });
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Server error' });
    }
});

app.post('/valid', async (req,res) => {
    try{
        const user = await Logins.findOne({ email : req.body.email });
        if (!user) {
            return res.status(400).json({ message : 'Authentication error Login again' });
        } else {
            if(user.message === 'welcome'){
                await Logins.updateOne({ email : req.body.email }, { message : '' });
                const user = await User.findOne({ email : req.body.email });
                console.log(`Welcome ${user.name}`);
                return res.status(200).json({ message : `Welcome ${user.name}` });
            }
            return res.status(200).json({message : 'Done'});
        }
    }catch (error){
        console.error(error);
        return res.status(500).json({ message : 'Server error' });
    }
});

app.post('/addRecord', upload.single('pic'), async (req,res) => {
    const {name, dob, email, phone, user} = req.body;
    try{
        console.log('Attempt to add record');
        if(!req.file.mimetype.startsWith('image/')){
            return res.status(400).json({ message : 'Only image files are allowed ' });
        }
        if(req.file.size > 2 * 1024 * 1024){
            return res.status(400).json({ message : 'Image size should be less than 2 MB' });
        }
        const record1 = await Record.findOne({ email : email });  
        if(record1){
            return res.status(400).json({ message : 'Email already exists with different person' });
        }
        const record2 = await Record.findOne({ phone : phone });  
        if(record2){
            return res.status(400).json({ message : 'Phone already exists with different person' });
        }
        const details = new Record({ username : user, name : name, dob :  dob, email : email, phone : phone, 
            pic : {
                data : Buffer.from(req.file.buffer).toString('base64'),
                extension : req.file.mimetype
            }});
        await details.save();
        console.log('Insertion successful');
        return res.status(200).json({ message : 'Insertion successful' });
    }
    catch(error){
        console.error(error);
        return res.status(500).json({ message : 'Server error' });
    }
});

app.post('/getRecords', async (req,res) => {
    try{
        console.log('Retrieval attempt');
        const records = await Record.find({ username : req.body.email }).sort(req.body.field);
        if(! records.length){
            console.log('Empty');
            return res.status(404).json({ message : 'Empty' });
        }
        console.log('Retrieval successful');
        return res.status(200).json({ records : records, message : 'Found' });
    }
    catch(error){
        console.error(error);
        return res.status(500).json({ message : 'Error retrieving records' });
    }
});

app.post('/deleteRecord', async (req,res) => {
    try{
        console.log('Deletion initiated');
        console.log(req.body.delid);
        const record = await Record.findOne({ email : req.body.delid });
        if(! record){
            return res.status(404).json({ message : 'Record not found' });
        }
        await Record.findOneAndDelete({email : req.body.delid });
        console.log('Record deleted successfully');
        return res.status(200).json({ message : 'Record deleted successfully' });
    }
    catch(error){
        console.error(error);
        return res.status(500).json({ message : 'Error deleting record' });
    }
});

app.post('/logout', async (req, res) => {
        try{
            console.log('Logout attempt')
            const user = await Logins.findOne({ email : req.body.email });
            if (!user) {
                return res.status(400).json({ message : 'No login found' });
            }
            await Logins.deleteOne({ email : user.email });
            console.log(`Logout Successful`); 
            const name =await User.findOne({ email : req.body.email });
            console.log(`Bye ${name.name}`);
            return res.status(200).json({ message: 'Logout successful' });
        }
        catch (error){
            console.error(error);
            return res.status(500).json({ message: 'Could not log out' });
        }
    });

const delAll = (async () => {
    await Logins.deleteMany({});
}); delAll();

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});