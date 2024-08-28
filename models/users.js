const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true},
    pseudo: { type: String, required: true, unique: true },
    role: { type: String, default: 'author'},
    confirmationToken: { type: String },
    avatarOptions: { 
        type: Map, 
        of: String, 
        default: {} 
    },
}, {timestamps: true})

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);