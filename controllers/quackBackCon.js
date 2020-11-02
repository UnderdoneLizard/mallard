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

// edit routes
router.get('/:id/edit', async (req, res) => {
    const quackBack = await db.QuackBack.findById(req.params.id).populate('user');
    const user = await db.User.findById(req.session.currentUser.id);
    context = {
        quackBack: quackBack
    }
    if(user.id = quackBack.user.id){
        res.render('quack/quackBackEdit', context)
    } else {
        res.redirect(`/quack/${quackBack.quack}`)
    }
})


router.put('/:id/edit', async (req, res) => {
    try {

        const quackBack = await db.QuackBack.findByIdAndUpdate(req.params.id, req.body, {
            new: true
        })
        res.redirect(`/quack/${quackBack.quack}`)

    } catch(error) {
        console.log(error);
        res.send({ message: "Internal server error" });
    }
})


router.delete('/:id/delete', async (req, res) => {
    try {

        const delQuackBack = await db.QuackBack.findByIdAndDelete(req.params.id).populate('quack').populate('user');
        const user = delQuackBack.user;
        const quack = delQuackBack.quack;
        user.quackBacks.remove(delQuackBack);
        quack.quackBacks.remove(delQuackBack);
        user.save();
        quack.save();
        res.redirect(`/quack/${quack.id}`);

    } catch(error) {
        console.log(error);
        res.send({ message: "Internal server error" });
    }
})

module.exports = router;