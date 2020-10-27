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
router.post('/register', async (req, res) => {
    console.log(req.body);
    try{
        const foundUser = await db.User.findOne({$or:[{email: req.body.email}, {username: req.body.username}]})
        //needs to be changed
        if(foundUser) return res.render("auth/test")

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
router.post('/login', async (req, res) => {
    try {
        const foundUser = await db.User.findOne({email: req.body.email});
        if(!foundUser) {
            //needs to be changed
            return res.render('auth/test');
        }
        const match = await bcrypt.compare(req.body.password, foundUser.password);
        if(!match){
             //needs to be changed
            return res.render('auth/test');
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


module.exports = router;