const jwt = require('jsonwebtoken');
const {assert} = require("../utils/errorHandler")
const bcrypt = require('bcrypt');
const messages = require("../utils/messages/user");

function checkConfirmationEmail(user) {
    assert(user.confirmationToken, "Veuillez confirmer votre email avant de vous connecter.", 400)
}

function generateToken(user) {
    const token = jwt.sign(
        { userId: user._id, role: user.role, pseudo: user.pseudo },
        process.env.AUTH_TOKEN,
        { expiresIn: '24h' }
    );
    return token;
}

function confirmationMessage(user) {
    if (user.email) {
        return {
            successMessage: messages.EMAIL_UPDATE_SUCCESS,
            errorMessage: messages.EMAIL_UPDATE_FAIL
        };
    }
    return {
        successMessage: messages.ACCOUNT_CREATE_SUCCESS,
        errorMessage: messages.ACCOUNT_CREATE_FAIL
    };
}

function updateUserForConfirmation(user) {
    user.email = user.newEmail || user.email;
    user.newEmail = undefined;
    user.confirmationToken = undefined;
}

async function saveUser(user) {
    try {
        await user.save();
        return { success: true, user };
    } catch (error) {
        return { success: false, error };
    }
}

function buildSearchUser(searchQuery) {
    const searchFilter = searchQuery
        ? { $or: [ 
            { pseudo: { $regex: searchQuery, $options: 'i' } }, 
            { email: { $regex: searchQuery, $options: 'i' } }
          ] }
        : {};
    return searchFilter
}

async function hashPassword(password) {
    const hash = await bcrypt.hash(password, 10);
    return hash;
}

module.exports = { checkConfirmationEmail, generateToken, confirmationMessage, updateUserForConfirmation, saveUser, buildSearchUser, hashPassword };