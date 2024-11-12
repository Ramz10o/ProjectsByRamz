const mongoose = require('mongoose');

const Users = mongoose.model('Users', new mongoose.Schema({
    username: {type:String, required:true, unique:true},
    email: {type:String, required:true, unique:true},
    password: {type:String, required:true},
}), 'Users');

const Logins = mongoose.model('Logins', new mongoose.Schema({
    username: {type:String, ref:'Users'},
}), 'Logins');

const Sockets = mongoose.model('Sockets', new mongoose.Schema({
    username: {type:String, ref:'Users'},
    socketId: {type:String, required:true},
}), 'Sockets');

const Chats = mongoose.model('Chats', new mongoose.Schema({
    from: {type:String, ref:'Users'},
    to: {type:String, ref:'Users'},
    type: {type:String, required:true},
    message: {type:String},
    time: {type:Date, default:Date.now}
}), 'Chats');


module.exports = {Users, Logins, Sockets, Chats};