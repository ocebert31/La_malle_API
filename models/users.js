const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    email: { type: String, unique: true, sparse: true },
    password: { type: String, required: true},
    pseudo: { type: String, required: true, unique: true },
    role: { type: String, enum: ['author', 'reader', 'admin'], default: 'reader' },
    confirmationToken: { type: String },
    newEmail: { type: String, unique: true, sparse: true },
    avatarOptions: { 
        type: Map, 
        of: String, 
        default: {} 
    },
}, {timestamps: true})

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);