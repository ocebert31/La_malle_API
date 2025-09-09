const User = require('../models/users');
const ValidationError = require("../utils/validators/validationError")
const ensureUserPresence = require("../utils/validators/ensureUserPresence");
const {registrationService, sessionService, confirmUserByToken, updateAvatarOptions, updateEmail, updatePassword, forgotPassword, resetPassword, getAllUser, updateUserRole} = require("../services/user")
const asyncHandler = require('../middlewares/asyncHandler');

exports.registration = asyncHandler(async (req, res) => {
    const user = await registrationService(req.body);
    res.status(201).json({ message: 'Utilisateur créé avec succès !', user });
});

exports.session = asyncHandler(async (req, res) => {
    const {user, token} = await sessionService(req.body)
    res.status(200).json({user: user, token: token});
});

exports.confirmation = asyncHandler(async (req, res) => {
    await confirmUserByToken(req, res);
});

exports.updateAvatarOptions = asyncHandler(async (req, res) => {
    const user = await updateAvatarOptions(req)
    res.status(200).json({ message: 'Options d\'avatar mises à jour', user });
})

exports.updateEmail = asyncHandler(async (req, res) => {
    await updateEmail(req)
    res.status(200).json({ message: 'Un e-mail de confirmation a été envoyé à votre nouvelle adresse.' });
})

exports.updatePassword = asyncHandler(async (req, res) => {
    await updatePassword(req, res)
    res.status(200).json({ message: 'Mot de passe mis à jour avec succès.' });
})

exports.forgotPassword = asyncHandler(async (req, res) => {
    await forgotPassword(req)
    res.status(200).json({ message: "Un e-mail de réinitialisation a été envoyé." });
})

exports.resetPassword = asyncHandler(async (req, res) => {
    await resetPassword(req)
    res.status(200).json({ message: "Mot de passe réinitialisé avec succès." });
})

exports.getAllUser = asyncHandler(async (req, res) => {
    const { currentPage, usersLimit, users } = await getAllUser(req)
    res.status(200).json({ page: currentPage, limit: usersLimit, users});
})

exports.updateUserRole = asyncHandler(async (req, res) => {
    const { user } = await updateUserRole(req)
    res.status(200).json(user);
})

exports.userData = async (req, res) => {
    try {
        const user = await User.findById(req.auth.userId).select('-password');
        ensureUserPresence(user);
        if (user.deleted_at) return res.status(403).json({ message: "Compte supprimé" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

exports.deleteUserByAdmin = async (req, res) => {
    const { id } = req.params;
    try {
        if (req.auth.role !== 'admin') return res.status(403).json({ message: "Accès refusé" });
        const user = await User.findById(id);
        ensureUserPresence(user);
        user.deleted_at = new Date();
        await user.save();
        res.status(200).json({ message: "Compte marqué comme supprimé" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression du compte", error: error.message });
    }
};

exports.purgeDeletedUsers = async () => {
    try {
        const threshold = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const result = await User.deleteMany({ deleted_at: { $lt: threshold } });
        console.log(`Purge des comptes supprimés : ${result.deletedCount} utilisateurs supprimés définitivement.`);
    } catch (error) {
        console.error("Erreur lors de la purge des utilisateurs supprimés :", error.message);
    }
};