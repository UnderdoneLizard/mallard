/* External Modules */
const express = require('express');
const methodOverride = require("method-override");
const session = require("express-session");
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const MongoStore = require("connect-mongo")(session)

/* Internal Modules */
const controllers = require('./controllers')
const db = require('./models')

/* Instanced Modules */

const app = express();



/* config */
const PORT = 3000
app.set('view engine', 'ejs');
app.use(express.static( path.join(__dirname, 'public')));

/* //settings for image upload copied from https://www.geeksforgeeks.org/upload-and-retrieve-image-on-mongodb-using-mongoose/
app.use(bodyParser.urlencoded({ extended: false })) 
*/
//might need this according to video https://youtu.be/3f5Q9wDePzY
app.use(bodyParser.json())
/* middleware */
app.use(express.static(path.join(__dirname , 'public')));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));


app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: "agentman",
    store: new MongoStore({
        url: process.env.MONGODB_URI || "mongodb://localhost:27017/quack-sessions"
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 2
    }
}))

// adds user to each page for now
app.use(async (req, res, next) => {
    if(req.session.currentUser){
    res.locals.user = await db.User.findById(req.session.currentUser.id);
    }else {
        res.locals.user = undefined;
    }
    next();
})

const authRequired = function(req, res, next) {
    if(!req.session.currentUser) {
        return res.redirect("/")
    }
    next();
}

/* Routes */
app.get('/', (req, res) => {
    if(req.session.currentUser){
        res.redirect("/user/home");
    } else {
        
        res.render('auth/landing')
    }
})

app.use('/user',authRequired, controllers.auth)

app.use('/quackBack',authRequired, controllers.quackBack)

app.use('/quack',authRequired, controllers.quack)

app.use('/search',authRequired, controllers.search)

// app.use('/upload', controllers.upload)

//login and register routes because I messed up
// register route
app.get('/register', async (req, res) => {
    res.render('auth/register', {message:''})
})

app.post('/register', async (req, res) => {
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
        res.redirect('/login');
        
    } catch (error) {
        console.log(error);
        res.send({ message: "Internal Server Error", err: error });
    }
})
// login route

app.get('/login', async (req, res) => {
    res.render('auth/login', {message:''})
})

app.post('/login', async (req, res) => {
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

        res.redirect('/user/home')

    } catch(error) {
        console.log(error);
        res.send({ message: "Internal Server Error", err: error });
    }
})

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})