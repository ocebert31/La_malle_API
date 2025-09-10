const jwt = require('jsonwebtoken');
const {assert} = require("../utils/errorHandler")
const bcrypt = require('bcrypt');

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
            successMessage: 'Votre adresse e-mail a été mise à jour avec succès.',
            errorMessage: 'Erreur lors de la confirmation de l\'adresse e-mail.'
        };
    }
    return {
        successMessage: 'Compte confirmé avec succès.',
        errorMessage: 'Erreur lors de la confirmation du compte.'
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