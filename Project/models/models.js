const mongoose = require('mongoose');

const Record = mongoose.model('Record', new mongoose.Schema({
    username : {type : String, required: true},
    name : {type : String, required: true},
    dob : {type : String, required: true},
    email : {type : String, required: true},
    phone : {type : String, required: true},
    pic : {
       data : { type : Buffer, required: true},
       extension : { type : String, required: true }
    }
}), 'Data');

const User = mongoose.model('User', new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
}), 'Credentials');

const Logins = mongoose.model('Logins', new mongoose.Schema({
    email :  { type: String, required: true },
    message : { type: String, required: true },
}), 'Logins');

module.exports = { Record, Logins, User };