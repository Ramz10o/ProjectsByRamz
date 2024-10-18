const express = require('express');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const multer = require('multer');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const PORT = 5000;

const db = mysql.createConnection({
    host: 'DataBase Host Here',
    user: 'DataBase User Here',
    password: 'DataBase Password Here',
    database: 'person_management_system'
});

db.connect(err => {
    if (err) throw err;
    console.log('Connected to DataBase');
    db.query('UPDATE Login SET isLoggedIn = ? WHERE isLoggedIn = ?', [false, true], (err) => {
        if (err) throw err;
    });
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('uploads'));

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        console.log('Login attempt');
        db.query('SELECT * FROM Login WHERE Email = ?', [email], async (err, results) => {
            if (err) throw err;

            const user = results[0];
            if (!user) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            db.query('UPDATE Login SET isLoggedIn = ? WHERE isLoggedIn = ?', [true, false]);
            console.log('Login Successful');
            return res.status(200).json({ message: 'Login Successful' });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
});

app.post('/addRecord', upload.single('pic'), async (req, res) => {
    const { name, dob, email, phone } = req.body;
    try {
        console.log('Attempt to add record');

        if (!req.file.mimetype.startsWith('image/')) {
            return res.status(400).json({ message: 'Only image files are allowed' });
        }
        if (req.file.size > 1024 * 1024) {
            return res.status(400).json({ message: 'Image size should be less than 1 MB' });
        }

        db.query('SELECT * FROM Records WHERE email = ? OR phone = ?', [email, phone], (err, results) => {
            if (err) throw err;

            if (results.length > 0) {
                return res.status(400).json({ message: 'Email or Phone already exists with different person' });
            }

            const picData = Buffer.from(req.file.buffer).toString('base64');
            const picExtension = req.file.mimetype;

            db.query('INSERT INTO Records (name, dob, email, phone, pic_data, pic_extension) VALUES (?, ?, ?, ?, ?, ?)', 
                [name, dob, email, phone, picData, picExtension], 
                (err) => {
                    if (err) throw err;
                    console.log('Insertion successful');
                    return res.status(200).json({ message: 'Insertion successful' });
                }
            );
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
});

app.post('/getRecords', async (req, res) => {
    try {
        console.log('Retrieval attempt');
        db.query('SELECT * FROM Records ORDER BY ??', [req.body.field], (err, results) => {
            if (err) throw err;

            if (!results.length) {
                console.log('Empty');
                return res.status(404).json({ message: 'Empty' });
            }

            console.log('Retrieval successful');
            return res.status(200).json({ records: results, message: 'Found' });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
});

app.post('/deleteRecord', async (req, res) => {
    try {
        console.log('Deletion initiated');
        const { delid } = req.body;

        db.query('DELETE FROM Records WHERE email = ?', [delid], (err, results) => {
            if (err) throw err;

            if (!results.affectedRows) {
                return res.status(404).json({ message: 'Record not found' });
            }

            console.log('Record deleted successfully');
            return res.status(200).json({ message: 'Record deleted successfully' });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
});

app.post('/logout', async (req, res) => {
    try {
        console.log('Logout attempt');
        
        db.query('UPDATE Login SET isLoggedIn = ? WHERE isLoggedIn = ?', [false, true], (err, results) => {
            if (err) throw err;

            if (!results.affectedRows) {
                return res.status(400).json({ message: 'No login found' });
            }

            console.log(`Logout Successful`);
            return res.status(200).json({ message: 'Logout successful' });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
});

app.post('/find', async (req, res) => {
    try {
        console.log('Find initiated');
        const query = req.body.query;

        db.query(
          'SELECT * FROM Records WHERE name LIKE ? OR email LIKE ? OR phone LIKE ? OR dob LIKE ?',
          [`%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`],
          (err, results) => {
              if (err) throw err;

              if (!results.length) {
                  console.log('Not Found');
                  return res.status(404).json({ message: 'No Records found' });
              }

              console.log('Find successful');
              return res.status(200).json({ message: 'Found', records: results });
          }
      );
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
});

app.post('/valid', async (req,res) =>{
    try{
        db.query('SELECT * FROM Login WHERE isLoggedIn = ?', [true], (err, results) => {
            if(err) throw err;
            
            if(!results.length){
                return res.status(400).json({});
            }
            
            return res.status(200).json({});
        });
    }
    catch(error){
      console.error(error);
      return res.status(500).json({ message : 'Server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});