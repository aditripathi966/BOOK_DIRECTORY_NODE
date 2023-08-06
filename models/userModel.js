const mongoose = require("mongoose");

const userModel = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    db:[{
        title:String,
        author:String,
        coverimage:String,
        datepublish:String,
        desc:String,
    }],
});
const user = mongoose.model("user", userModel);

module.exports = user;