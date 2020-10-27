const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const { render } = require("ejs")

const db = require('../models');


/* BASE TEST PATH */
router.get("/", (req,res) => {
    res.render('auth/test');
})

router.post('/register', async (req, res) => {
    console.log(req.body);
    try{
        const foundUser = await db.User.findOne({$or:[{email: req.body.email}, {username: req.body.username}]})
        if(foundUser) return res.render("auth/test")

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(req.body.password, salt);
        req.body.password = hash;
        await db.User.create(req.body);
        res.redirect('/');
        
    } catch (error) {
        console.log(error);
        res.send({ message: "Internal Server Error", err: error });
    }
})

module.exports = router;