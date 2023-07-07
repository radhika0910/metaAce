const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },

        email: {
            type: String,
            unique: true,
            required: true,
        },

        password: {
            type: String,
            minlength: 6, // at least six characters long
            required: true,
        },
    },
    { timestamps: true }
);

const user = mongoose.model('user', userSchema)


module.exports = user;
