const mongoose = require('mongoose');

const quackSchema = mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    content: {type:String, required: true},
    //media:,
    likes: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
    dislikes: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
    quackBacks: [{type: mongoose.Schema.Types.ObjectId, ref:"QuackBack"}],
    //reposts:,
    //reference:,
    //userIcon:
}, {
    timestamps: true,
})


const Quack = mongoose.model('Quack', quackSchema)
module.exports = Quack;