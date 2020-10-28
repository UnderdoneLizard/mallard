/* External Modules */
const express = require('express');
const methodOverride = require("method-override");
const session = require("express-session");
const path = require('path');

const MongoStore = require("connect-mongo")(session)

/* Internal Modules */
const controllers = require('./controllers')
const db = require('./models')

/* Instanced Modules */

const app = express();

/* config */
const PORT = 3000
app.set('view engine', 'ejs');

/* middleware */
app.use(express.static(path.join(__dirname, 'public')));
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
    }else{
        user = undefined;
    }
    next();
})


/* Routes */
app.use('/', controllers.auth)

app.use('/quack', controllers.quack)

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})