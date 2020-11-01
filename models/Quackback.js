const mongoose = require('mongoose');
const { quack } = require('../controllers');

const quackBackSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref="User"},
    quack: {type: mongoose.Schema.Types.ObjectId, ref="Quack"},
    content: {type: String, required: true},
    likes: [{type: mongoose.Schema.Types.ObjectId, ref="User"}],
    dislikes: [{type: mongoose.Schema.Types.ObjectId, ref="User"}],

},{
    timestamps: true
})

const QuackBack = mongoose.models("Comment", quackBackSchema);

module.exports = QuackBack;