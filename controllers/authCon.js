const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const { render } = require("ejs")

const db = require('../models');


/* BASE TEST PATH */
router.get("/", (req,res) => {
    res.render('auth/test');
})


// register route
router.get('/register', async (req, res) => {
    res.render('auth/register', {message:''})
})

router.post('/register', async (req, res) => {
    console.log(req.body);
    try{
        const foundUser = await db.User.findOne({$or:[{email: req.body.email}, {username: req.body.username}]})
        //needs to be changed
        if(foundUser) return res.render("auth/register", {message:'Username or Email taken, please use another'})

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(req.body.password, salt);
        req.body.password = hash;
        await db.User.create(req.body);
        //needs to be changed
        res.redirect('/');
        
    } catch (error) {
        console.log(error);
        res.send({ message: "Internal Server Error", err: error });
    }
})

// login route

router.get('/login', async (req, res) => {
    res.render('auth/login', {message:''})
})

router.post('/login', async (req, res) => {
    try {
        const foundUser = await db.User.findOne({email: req.body.email});
        if(!foundUser) {
            //needs to be changed
            return res.render('auth/login', {message:"Email or Passowrd Incorrect"});
        }
        const match = await bcrypt.compare(req.body.password, foundUser.password);
        if(!match){
             //needs to be changed
            return res.render('auth/login', {message:"Email or Passowrd Incorrect"});
        }
        req.session.currentUser = {
            username: foundUser.username,
            id: foundUser._id,
        }

        res.redirect('/')

    } catch(error) {
        console.log(error);
        res.send({ message: "Internal Server Error", err: error });
    }
})

//logout
router.delete('/logout', async (req, res) => {
    await req.session.destroy();
    res.redirect('/');
})


//follow route
router.put('/:id/follow', async (req, res) => {
    try{
        const user = await db.User.findById(req.session.currentUser.id);
        const tUser = await db.User.findById(req.params.id);
        user.following.push(tUser.id);
        tUser.followers.push(user.id);
        user.save();
        tUser.save();
        res.redirect('/');
    } catch(error) {
        console.log(error);
        res.send({ message: "Internal Server Error", err: error });
    }
})


module.exports = router;