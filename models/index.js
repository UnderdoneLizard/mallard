const mongoose = require("mongoose");
const connectionString = "mongodb://localhost:27017/quack";

mongoose
.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: true,
})
.then(function() {
    console.log("mongodb conneted...");
})
.catch(function (error) {
    console.log("Mongodb connection error", error);
})

mongoose.connection.on("disconnect", function (event) {
    console.log("mongodb disconnected", event);
})

module.exports = {
    User: require("./User"),
    Quack: require("./Quack"),
    Comment: require("./QuackBack")
}