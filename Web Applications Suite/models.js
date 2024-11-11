const mongoose = require('mongoose');
const fs = require('fs');

let img = fs.readFileSync('./Web Application Suite/default.jpg').toString('base64');

const Users = mongoose.model('Users', new mongoose.Schema({
    username: {type:String, required:true, unique:true},
    email: {type:String, required:true, unique:true},
    password: {type:String, required:true},
    pic: {type:String, default: img}
}), 'Users');

const Logins = mongoose.model('Logins', new mongoose.Schema({
    user: {type:mongoose.Schema.Types.ObjectId, ref:'Users'},
}), 'Logins');

const Sockets = mongoose.model('Sockets', new mongoose.Schema({
    user: {type:mongoose.Schema.Types.ObjectId, ref:'Users'},
    socketId: {type:String, required:true},
    app: {type:String, required:true}
}), 'Sockets');

const Chats = mongoose.model('Chats', new mongoose.Schema({
    from: {type:mongoose.Schema.Types.ObjectId, ref:'Users'},
    to: {type:mongoose.Schema.Types.ObjectId, ref:'Users'},
    type: {type:String, required:true},
    message: {type:String, required:true},
    time: {type:Date, default:Date.now}
}), 'Chats');

const Leaderboard = mongoose.model('Leaderboard', new mongoose.Schema({
    user: {type:mongoose.Schema.Types.ObjectId, ref:'Users'},
    game: {type:String, required:true},
    score: {type:Number, default:0},
}), 'Leaderboard');

module.exports = {Users, Logins, Sockets, Chats, Leaderboard};