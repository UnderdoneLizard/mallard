const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const { render } = require("ejs")

const db = require('../models');


/* BASE TEST PATH */
router.get("/home", async (req,res) => {
    try {
        
        const user = await db.User.findById(req.session.currentUser.id)
        const feed = await db.Quack.find({ user:{ $in: user.following}}).populate('user').sort({createdAt: -1});
        console.log(feed);
        const context = {
            quacks:feed
        };

        res.render('core/home', context);

    } catch(error) {
        console.log(error);
        res.send({ message: "Internal Server Error", err: error });
    }
})


/* index for users // will be refactored to the search show and follower/ following show */
/* router.get('/users', async (req, res) => {
    const users = await db.Users.find();
    res.render('users', {users: users})
}) */



//edit user
router.get('/edit', (req,res) => {
    res.render('auth/edit', {message:''});
})

router.put('/edit', async (req, res) => {
    try {

        const foundUser = await db.User.find({$or:[{email: req.body.email}, {username: req.body.username}]}).populate("quacks")
        if(foundUser.length > 1 ) return res.render("auth/edit", {message:'Username or Email taken, please use another'})
        await db.User.findByIdAndUpdate(req.session.currentUser.id, req.body, {
            new: true
        })
/*         const user = foundUser[0];
        user.quacks.forEach( quack => {
            quack.username = req.body.username;
            quack.displayName = req.body.displayName;
            quack.save();
        }) */
        res.redirect(`/user/${req.session.currentUser.id}`)
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
//deleteUser route
router.delete('/delete', async (req, res) => {
    try{
        const delUser = await db.User.findByIdAndDelete(req.session.currentUser.id);
        delUser.followers.forEach(async (follower) => {
            const user = await db.User.findById(follower);
            user.following.remove(delUser);
        })
        delUser.following.forEach(async (follow) => {
            const user = await db.User.findById(follow);
            user.followers.remove(delUser);
        })
        res.redirect('/')
    } catch(error){
        console.log(error);
        res.send({ message: "Internal server error" })
    }
})

//render profile page
router.get('/:id', async (req, res) => {
    try{

        const tUser = await db.User.findById(req.params.id).populate('userIcon');
        const quacks = await db.Quack.find({user: tUser.id}).sort({createdAt: -1}).populate('user');
        const context = {
            tUser: tUser,
            quacks: quacks
        }
        res.render('auth/profile', context)

    } catch(error) {
        console.log(error);
        res.send({ message: "Internal Server Error", err: error });
    }
})

//render followers and following pages

router.get("/:id/followers", async (req, res) => {
    try{

        const tUser = await db.User.findById(req.params.id).populate("followers");
        const results =tUser.followers;
        context = {
            results: results,
            title: "Followers"
        }
        res.render("auth/userList", context)

    } catch (error) {
        console.log(error);
        res.send({ message: "Internal Server Error", err: error });
    }
})

router.get("/:id/following", async (req, res) => {
    try{

        const tUser = await db.User.findById(req.params.id).populate("following");
        console.log(tUser);
        const results = tUser.following;
        context = {
            results: results,
            title: "Following"
        }
        res.render("auth/userList", context)

    } catch (error) {
        console.log(error);
        res.send({ message: "Internal Server Error", err: error });
    }
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
        res.redirect(`/user/${req.params.id}`);
    } catch(error) {
        console.log(error);
        res.send({ message: "Internal Server Error", err: error });
    }
})

//unfollow 
router.put('/:id/unfollow', async (req, res) => {
    try {
        
        const user = await db.User.findById(req.session.currentUser.id);
        const tUser = await db.User.findById(req.params.id);
        user.following.remove(tUser.id);
        tUser.followers.remove(user.id);
        user.save();
        tUser.save();
        res.redirect(`/user/${req.params.id}`);

    } catch(error) {
        console.log(error);
        res.send({ message: "Internal Server Error", err: error });
    }
})

//like quack
router.put('/:id/like', async (req, res) => {
    try {
        const user = await db.User.findById(req.session.currentUser.id);
        const quack = await db.Quack.findById(req.params.id);
        user.likes.push(quack.id);
        quack.likes.push(user.id);
        if( quack.dislikes.includes(user.id)){
            quack.dislikes.remove(user.id)
        }
        user.save();
        quack.save();
        res.redirect(`/quack/${quack.id}`);
    } catch(error) {
        console.log(error);
        res.send({ message: "Internal Server Error", err: error });
    }
})

//unlike quack
router.put('/:id/unlike', async (req, res) => {
    try {
        const user = await db.User.findById(req.session.currentUser.id);
        const quack = await db.Quack.findById(req.params.id);
        user.likes.remove(quack.id);
        quack.likes.remove(user.id);
        user.save();
        quack.save();
        res.redirect(`/quack/${quack.id}`);
    } catch(error) {
        console.log(error);
        res.send({ message: "Internal Server Error", err: error });
    }
})

//dislike route
router.put('/:id/dislike', async (req,res) => {
    try {

        const user = await db.User.findById(req.session.currentUser.id);
        const quack = await db.Quack.findById(req.params.id);
        quack.dislikes.push(user.id);
        if(quack.likes.includes(user.id)) quack.likes.remove(user.id);
        if(user.likes.includes(quack.id)) user.likes.remove(quack.id);
        user.save();
        quack.save();
        res.redirect(`/quack/${quack.id}`);

    } catch(error) {
        console.log(error);
        res.send({ message: "Internal Server Error", err: error });
    }
})




//editUser route

module.exports = router;