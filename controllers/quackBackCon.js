const express = require("express");
const router = express.Router();

const db = require("../models");

router.post('/create', async (req,res) => {
    try {

        const user = await db.User.findById(req.session.currentUser.id);
        const quack = await db.Quack.findById(req.body.quack);
        const newQuackBack = await db.QuackBack.create(req.body);
        newQuackBack.quack = quack.id;
        newQuackBack.user = user.id;
        quack.quackBacks.push(newQuackBack.id);
        user.quackBacks.push(newQuackBack.id);
        user.save();
        quack.save();
        newQuackBack.save();
        res.redirect(`/quack/${quack.id}`);

    } catch(error) {
        console.log(error);
        res.send({ message: "Internal server error" });
    }
})

module.exports = router;