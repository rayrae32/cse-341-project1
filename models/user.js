const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, required: true, unique: true },
    password: String,
    googleId: String
});

module.exports = mongoose.model("User", UserSchema);