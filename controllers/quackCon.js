const express = require("express");
const router = express.Router();

const db = require("../models");

 /* all posts page */
/* 
router.get('/', async (req, res) => {
    try{

        const quacks = await db.Quack.find();
        context = {
            quacks: quacks
        }
        res.render('quack/index', context)

    } catch(error) {
        console.log(error);
        res.send({ message: "Internal server error" });
    }
}) */

//create quack
// TODO render create quack page 
router.get('/create', async (req,res) => {
    res.render('quack/create');
})

router.post('/create', async (req,res) => {
    try{

        const user = await db.User.findById(req.session.currentUser.id);
        const quack = await db.Quack.create(req.body);
        quack.user = user.id;
        quack.username = user.username;
        quack.displayName = user.displayName;
        user.quacks.push(quack.id);
        user.save();
        quack.save();
        res.redirect(`/user/${req.session.currentUser.id}`)

    } catch(error) {
        console.log(error);
        res.send({ message: "Internal server error" });
    }
})

//show quack
router.get('/:id', async (req, res) => {
    try{
        
        const quack = await db.Quack.findById(req.params.id).populate({
            path:'quackBacks',
            populate: {
                path: 'user',
                model: 'User'
            }
        }).populate('user');
        context = {
            quack: quack
        };
        res.render('quack/show', context);

    } catch(error) {
        console.log(error);
        res.send({ message: "Internal server error" });
    }
})

//edit a quack
router.get('/:id/edit', async (req,res) => {
    try{

        const quack = await db.Quack.findById(req.params.id);
        if(req.session.currentUser.id == quack.user){
        context = {
            quack: quack
        }
        res.render('quack/edit', context)
    }
    res.send("you should not have seen this button")

    } catch(error) {
        console.log(error);
        res.send({ message: "Internal server error" });
    }
})

router.put("/:id/edit", async (req, res) => {
    try {

        await db.Quack.findByIdAndUpdate(req.params.id, req.body, {
            new: true
        })

        res.redirect(`/quack/${req.params.id}`);

    } catch(error) {
        console.log(error);
        res.send({ message: "Internal server error" });
    }
})

//delete quack

router.delete('/:id/delete', async (req, res) => {
    try{
        const quack = await db.Quack.findById(req.params.id)
        if (req.session.currentUser.id == quack.user){
            const delQuack = await db.Quack.findByIdAndDelete(req.params.id).populate({
                path:"quackBacks",
                populate:{
                    path: "user",
                    model:"User"
                }
            }).populate("likes");

            delQuack.likes.forEach( (user) =>{
                user.likes.remove(delQuack.id);
                user.save();
            })
            delQuack.quackBacks.forEach( async (quackBack) => {
                quackBack.user.quackBacks.remove(quackBack.id);
                quackBack.user.save();
                await db.QuackBack.findByIdAndDelete(quackBack.id);
            })
            res.redirect(`/user/${req.session.currentUser.id}`);
        } else {
            res.send('you souldnt have seen that button');
        }

    } catch (error) {
        console.log(error);
        res.send({ message: "Internal server error here" });
    }
})

module.exports = router