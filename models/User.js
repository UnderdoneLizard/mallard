const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: { type: String, required: true, unique: true},
    displayName: { type: String, required: true},
    email: { type: String, required: true, unique: true},
    password: {type: String, required: true},
    quacks: [{type: mongoose.Schema.Types.ObjectId, ref: 'Quack'}],
    following: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    followers:[{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    likes: [{type: mongoose.Schema.Types.ObjectId, ref: 'Quack'}],
    // comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}]
},{
    timestamps: true
})

const User = mongoose.model('User', userSchema);
module.exports = User;