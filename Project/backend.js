const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const multer = require('multer');
const cors = require('cors');
require('dotenv').config();
const { Records, Login } = require('./models/models');

const app = express();
const PORT = 5000;
const URI = "mongodb+srv://personmanagementsystem:Pa85kZ8tWUfQ7Bvi@cluster0.h5bxp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const logout = (async () => {
    if(Login.findOne({isLoggedIn : true})){
        await Login.findOneAndUpdate({isLoggedIn : true},{isLoggedIn : false});
    }
});
const login = (async () => {
    if(Login.findOne({isLoggedIn : false})){
        await Login.findOneAndUpdate({isLoggedIn : false},{isLoggedIn : true});
    }
}); 

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('uploads'));

mongoose.connect(URI, { dbName : 'UserData' }, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        console.log('Login attempt');
        const user = await Login.findOne({ email : email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        login();
        console.log('Login Successful');
        return res.status(200).json({ message : 'Login Successful'});
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Server error' });
    }
});

app.post('/addRecord', upload.single('pic'), async (req,res) => {
    const {name, dob, email, phone, user} = req.body;
    try{
        console.log('Attempt to add record');
        if(!req.file.mimetype.startsWith('image/')){
            return res.status(400).json({ message : 'Only image files are allowed ' });
        }
        if(req.file.size > 1024 * 1024){
            return res.status(400).json({ message : 'Image size should be less than 1 MB' });
        }
        const record1 = await Records.findOne({ email : email });  
        if(record1){
            return res.status(400).json({ message : 'Email already exists with different person' });
        }
        const record2 = await Records.findOne({ phone : phone });  
        if(record2){
            return res.status(400).json({ message : 'Phone already exists with different person' });
        }
        const details = new Records({ username : user, name : name, dob :  dob, email : email, phone : phone, 
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
        const records = await Records.find({}).sort(req.body.field);
        if(! records.length){
            console.log('Empty');
            return res.status(404).json({ message : 'Empty' });
        }
        console.log('Retrieval successful');
        return res.status(200).json({ records : records, message : 'Found' });
    }
    catch(error){
        console.error(error);
        return res.status(500).json({ message : 'Server error' });
    }
});

app.post('/deleteRecord', async (req,res) => {
    try{
        console.log('Deletion initiated');
        const record = await Records.findOne({ email : req.body.delid });
        if(! record){
            return res.status(404).json({ message : 'Record not found' });
        }
        await Records.findOneAndDelete({ email : req.body.delid });
        console.log('Record deleted successfully');
        return res.status(200).json({ message : 'Record deleted successfully' });
    }
    catch(error){
        console.error(error);
        return res.status(500).json({ message : 'Server error' });
    }
});

app.post('/logout', async (req, res) => {
        try{
            console.log('Logout attempt')
            const user = await Login.findOne({ isLoggedIn : true });
            if (!user) {
                return res.status(400).json({ message : 'No login found' });
            }
            logout();
            console.log(`Logout Successful`); 
            return res.status(200).json({ message: 'Logout successful' });
        }
        catch (error){
            console.error(error);
            return res.status(500).json({ message: 'Server error' });
        }
    });

app.post('/find', async (req,res) => {
        try{
            console.log('Find initiated');
            const query = req.body.query;
            const records = await Records.find({ $or: 
                [ {name : query}, {email : query}, {phone : query}, {dob : query} ] 
            });
            if(! records.length){
                console.log('Not Found');
                return res.status(404).json({ message : 'No Records found' });
            }
            console.log('find successful');
            return res.status(200).json({ message : 'Found', records : records });
        }
        catch(error){
            console.error(error);
            return res.status(500).json({ message : 'Server error' });
        }
    });

app.post('/valid', async (req,res) =>{
    try{
        if(! await Login.findOne({isLoggedIn : true})){
            return res.status(400).json({});
        }
        return res.status(200).json({});
    }
    catch(error){
        console.error(error);
        return res.status(500).json({ message : 'Server error' });
    }
});

logout();

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});