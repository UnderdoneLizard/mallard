const express = require("express");
const router = express.Router();

const db = require("../models");

//create quack
// TODO render create quack page 

router.post('/create', async (req,res) => {
    try{

        const quack = await db.Quack.create(req.body);
        quack.user = req.session.currentUser.id;
        quack.save()
        res.redirect('/')

    } catch(error) {
        console.log(error);
        res.send({ message: "Internal server error" });
    }
})

//delete quack



module.exports = router