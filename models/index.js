const mongoose = require("mongoose");
const connectionString = "mongodb://localhost:27017/quack";
//from video https://youtu.be/3f5Q9wDePzY
const Grid = require('gridfs-stream');

mongoose
.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
})
.then(function() {
    console.log("mongodb conneted...");
})
.catch(function (error) {
    console.log("Mongodb connection error", error);
})

//set up stream thing for getting images from video https://youtu.be/3f5Q9wDePzY
const conn = mongoose.createConnection("mongodb://localhost:27017/quack");

let gfs;
conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo)
    gfs.collection('photos')
})


mongoose.connection.on("disconnect", function (event) {
    console.log("mongodb disconnected", event);
})

module.exports = {
    User: require("./User"),
    Quack: require("./Quack"),
    QuackBack: require("./QuackBack"),
    gfs: gfs,
}