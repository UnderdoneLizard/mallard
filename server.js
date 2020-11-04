/* External Modules */
const express = require('express');
const methodOverride = require("method-override");
const session = require("express-session");
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')


const MongoStore = require("connect-mongo")(session)

/* Internal Modules */
const controllers = require('./controllers')
const db = require('./models')

/* Instanced Modules */

const app = express();



/* config */
const PORT = 3000
app.set('view engine', 'ejs');
app.set('public', path.join(__dirname, 'public'));

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
        return res.redirect("/user/login")
    }
    next();
}

/* Routes */
app.get('/', (req, res) => {
    if(req.session.currentUser){
        res.redirect("/user/home");
    } else {
        
        res.render('auth/test')
    }
})

app.use('/user',controllers.auth)

app.use('/quackBack', controllers.quackBack)

app.use('/quack', controllers.quack)

app.use('/search', controllers.search)

// app.use('/upload', controllers.upload)


app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})