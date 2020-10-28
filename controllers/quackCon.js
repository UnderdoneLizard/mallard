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

router.delete('/:id/delete', async (req, res) => {
    try{
        const quack = await db.Quack.findById(req.params.id);
        if (req.session.currentUser.id === quack.user){
            const delQuack = await db.Quack.findByIdAndDelete(req.params.id);
            delQuack.likes.forEach(async (like) =>{
                const user = await db.User.findById(like);
                user.likes.remove(delQuack);
                user.save();
            })
            res.redirect('/');
        }

    } catch (error) {
        console.log(error);
        res.send({ message: "Internal server error here" });
    }
})

module.exports = router