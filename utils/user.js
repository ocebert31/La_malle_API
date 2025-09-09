const jwt = require('jsonwebtoken');

function checkConfirmationEmail(user) {
    if (user.confirmationToken) {
        throw new ValidationError("Veuillez confirmer votre email avant de vous connecter.");
    }
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

function sendResponseForConfirmation(res, result, successMessage, errorMessage) {
    if (result.success) {
        res.status(201).json({ message: successMessage, user: result.user });
    } else {
        res.status(500).json({ message: errorMessage, error: result.error.message });
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

module.exports = { checkConfirmationEmail, generateToken, confirmationMessage, updateUserForConfirmation, saveUser, sendResponseForConfirmation, buildSearchUser };