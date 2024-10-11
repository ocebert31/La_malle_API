const User = require('../models/users');
const jwt = require('jsonwebtoken');
const { uniqueNamesGenerator, adjectives, colors, animals } = require('unique-names-generator');
const { sendConfirmationEmail } = require('../utils/sendConfirmationEmail');
const crypto = require('crypto');
const requiredEmail = require("../utils/validators/requiredEmail");
const ValidationError = require("../utils/validators/validationError")
const requiredPassword = require("../utils/validators/requiredPassword");
const confirmPasswordMatch = require("../utils/validators/confirmPasswordMatch");
const confirmPasswordHashMatch = require("../utils/validators/confirmPasswordHashMatch");
const passwordTooShort = require("../utils/validators/passwordTooShort");
const hashPassword = require("../utils/validators/hashPassword");
const checkExistingUser = require("../utils/validators/checkExistingUser");
const ensureUserPresence = require("../utils/validators/ensureUserPresence");

exports.registration = async (req, res) => {
    const { email, password, confirmPassword } = req.body;
    try {
        requiredEmail(email);
        requiredPassword(password);
        confirmPasswordMatch(password, confirmPassword);
        passwordTooShort(password);
        await checkExistingUser(email)
        const user = await initializeUser(password, email)
        await user.save();
        await sendConfirmationEmail(user, 'signup');
        res.status(201).json({ message: 'Utilisateur créé avec succès !', user });
    } catch (error) {
        return res.status(500).json({ message: 'Erreur lors de la création de l\'utilisateur.', error: error.message });
    }
};

async function initializeUser(password, email) {
    const pseudo = uniqueNamesGenerator({
        dictionaries: [colors, adjectives, animals],
        length: 3,
        separator: '_'
    });
    const confirmationToken = crypto.randomBytes(20).toString('hex');
    const hashedPassword = await hashPassword(password);
    const user = new User({
        newEmail: email,
        password: hashedPassword,
        pseudo: pseudo,
        confirmationToken,
    });
    return user;
}

exports.session = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email: email });
        requiredEmail(email)
        requiredPassword(password)
        await confirmPasswordHashMatch(password, user)
        ensureUserPresence(user)
        checkConfirmationEmail(user)
        const token = generateToken(user);
        res.status(200).json({user: user, token: token});
    } catch (error) {
        res.status(500).json({ message: "Impossible de se connecter", error: error.message });
    }
};

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

exports.confirmation = async (req, res) => {
    const { token } = req.params;
    try {
        const user = await User.findOne({ confirmationToken: token });
        ensureUserPresence(user);
        const { successMessage, errorMessage } = updateUserEmailOrAccount(user);
        user.email = user.newEmail;
        user.newEmail = undefined;
        user.confirmationToken = undefined;
        saveUserAndRespond(user, res, successMessage, errorMessage)
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la confirmation.', error: error.message });
    }
};

function updateUserEmailOrAccount(user) {
    const successMessage = user.email ? 'Votre adresse e-mail a été mise à jour avec succès.' : 'Compte confirmé avec succès.';
    const errorMessage = user.email ? 'Erreur lors de la confirmation de l\'adresse e-mail.' : 'Erreur lors de la confirmation du compte.';
    return {successMessage, errorMessage}
}

async function saveUserAndRespond(user, res, successMessage, errorMessage) {
    try {
        await user.save();
        res.status(200).json({ message: successMessage, user });
    } catch (error) {
        res.status(500).json({ message: errorMessage, error: error.message });
    }
}

exports.updateAvatarOptions = async (req, res) => {
    const userId = req.auth.userId;
    const avatarOptions = req.body.avatarOptions;
    try {
        const user = await User.findByIdAndUpdate(
            userId,
            { avatarOptions },
            { new: true }
        );
        ensureUserPresence(user);  
        res.status(200).json({ message: 'Options d\'avatar mises à jour', user });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de l'édition de l'avatar.", error: error.message });
    }
};

exports.updateEmail = async (req, res) => {
    const { newEmail, currentPassword } = req.body;
    try {
        requiredEmail(newEmail)
        requiredPassword(currentPassword)
        const user = await User.findById(req.auth.userId);
        passwordTooShort(currentPassword)
        confirmPasswordHashMatch(currentPassword, user)
        await checkExistingUser(newEmail)
        user.confirmationToken = crypto.randomBytes(20).toString('hex');
        user.newEmail = newEmail;
        await user.save();
        await sendConfirmationEmail(user, 'update');
        res.status(200).json({ message: 'Un e-mail de confirmation a été envoyé à votre nouvelle adresse.' });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour de l'adresse e-mail.", error: error.message });
    }
}

exports.updatePassword = async (req, res) => {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;
    try {
        if (requiredPassword(currentPassword, res) || requiredPassword(newPassword, res) || requiredPassword(confirmNewPassword, res)) {
            return; 
        }
        await confirmPasswordMatch(newPassword, confirmNewPassword, res);
        passwordTooShort(newPassword, res)
        const user = await User.findById(req.auth.userId);
        ensureUserPresence(user);
        await confirmPasswordHashMatch(currentPassword, user, res)
        const hashedPassword = await hashPassword(newPassword);
        user.password = hashedPassword;
        await user.save();
        res.status(200).json({ message: 'Mot de passe mis à jour avec succès.' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour du mot de passe.', error: error.message });
    }
};

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        requiredEmail(email)
        const user = await User.findOne({ email});
        ensureUserPresence(user);
        user.confirmationToken = crypto.randomBytes(20).toString('hex');
        await user.save();
        await sendConfirmationEmail(user, 'forgotPassword');
        res.status(200).json({ message: "Un e-mail de réinitialisation a été envoyé." });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la demande de réinitialisation du mot de passe.", error: error.message });
    }
};

exports.resetPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword, confirmNewPassword } = req.body;
    try {
        requiredPassword(newPassword);
        requiredPassword(confirmNewPassword);
        confirmPasswordMatch(newPassword, confirmNewPassword);
        passwordTooShort(newPassword);
        const user = await User.findOne({ confirmationToken: token });
        ensureUserPresence(user);
        const hashedPassword = await hashPassword(newPassword);
        user.password = hashedPassword;
        user.confirmationToken = undefined;
        await user.save();
        res.status(200).json({ message: "Mot de passe réinitialisé avec succès." });
    } catch (error) {
        return res.status(500).json({ message: "Erreur lors de la réinitialisation du mot de passe.", error: error.message });
    }
};

exports.getAllUser = async (req, res) => {
    const { page = 1, limit = 10, searchQuery = '' } = req.query;
    const currentPage = parseInt(page, 10);
    const usersLimit = parseInt(limit, 10);
    const skip = (currentPage - 1) * usersLimit;
    try {
        const users = await User.find(buildSearchFilter(searchQuery))
            .skip(skip)
            .limit(usersLimit);
        res.status(200).json({ page: currentPage, limit: usersLimit, users});
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des utilisateurs", error: error.message });
    }
};

function buildSearchFilter(searchQuery) {
    const searchFilter = searchQuery
        ? { $or: [ 
            { pseudo: { $regex: searchQuery, $options: 'i' } }, 
            { email: { $regex: searchQuery, $options: 'i' } }
          ] }
        : {};
    return searchFilter
}

exports.updateUserRole = async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;
    try {
        isValidRole(role)
        const user = await updateUserRoleInDB(id, role);
        ensureUserPresence(user);
        res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: 'Erreur du serveur lors du changement de rôle', error: error.message });
    }
};

function isValidRole(role) {
    if (!['author', 'reader', 'admin'].includes(role)) {
        throw new ValidationError("Rôle invalide");
    }
}

async function updateUserRoleInDB(id, role) {
    return await User.findByIdAndUpdate(id, { role }, { new: true });
}

exports.userData = async (req, res) => {
    try {
        const user = await User.findById(req.auth.userId).select('-password'); 
        ensureUserPresence(user);
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};







