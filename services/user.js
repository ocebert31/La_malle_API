const crypto = require('crypto');
const User = require("../models/users");
const userBuilder = require("../factories/user");
const checkExistingUser = require("../utils/validators/checkExistingUser");
const confirmPasswordHashMatch = require("../utils/validators/confirmPasswordHashMatch");
const ensureUserPresence = require("../utils/validators/ensureUserPresence");
const { sendConfirmationEmail } = require('../mail/sendConfirmationEmail');
const { registrationValidation, sessionValidation, updateEmailValidation, updatePasswordValidation, 
    forgotPasswordValidation, resetPasswordValidation } = require("../validations/userValidation");
const {  checkConfirmationEmail, generateToken, confirmationMessage, updateUserForConfirmation, 
    saveUser, buildSearchUser, hashPassword } = require("../utils/user");
const {validate, assert} = require("../utils/errorHandler")

async function registration({ email, password, confirmPassword }) {
    validate(registrationValidation, { email, password, confirmPassword });
    await checkExistingUser(email);
    const user = await userBuilder(password, email);
    await user.save();
    await sendConfirmationEmail(user, 'signup');
    return user;
}

async function session({ email, password }) {
    validate(sessionValidation, { email, password });
    const user = await User.findOne({ email });
    ensureUserPresence(user);
    assert(user.deleted_at, "Compte supprimé", 403);
    await confirmPasswordHashMatch(password, user);
    checkConfirmationEmail(user);
    const token = generateToken(user);
    return { user, token };
}

async function confirmUserByToken(token) {
    const user = await User.findOne({ confirmationToken: token });
    ensureUserPresence(user);
    const { successMessage, errorMessage } = confirmationMessage(user);
    updateUserForConfirmation(user);
    const result = await saveUser(user);
    return { result, successMessage, errorMessage };
}

async function updateAvatarOptions(userId, avatarOptions) {
    const user = await User.findByIdAndUpdate(
        userId,
        { avatarOptions },
        { new: true }
    );
    ensureUserPresence(user);
    return user;
}

async function updateEmail(userId, newEmail, currentPassword) {
    validate(updateEmailValidation, { newEmail, currentPassword });
    const user = await User.findById(userId);
    ensureUserPresence(user);
    await confirmPasswordHashMatch(currentPassword, user);
    await checkExistingUser(newEmail);
    user.confirmationToken = crypto.randomBytes(20).toString('hex');
    user.newEmail = newEmail;
    await user.save();
    await sendConfirmationEmail(user, 'update');
}

async function updatePassword(userId, currentPassword, newPassword, confirmNewPassword) {
    validate(updatePasswordValidation, { currentPassword, newPassword, confirmNewPassword });
    const user = await User.findById(userId);
    ensureUserPresence(user);
    await confirmPasswordHashMatch(currentPassword, user);
    user.password = await hashPassword(newPassword);
    await user.save();
}

async function forgotPassword(email) {
    validate(forgotPasswordValidation, { email });
    const user = await User.findOne({ email });
    ensureUserPresence(user);
    user.confirmationToken = crypto.randomBytes(20).toString('hex');
    await user.save();
    await sendConfirmationEmail(user, 'forgotPassword');
}

async function resetPassword(token, newPassword, confirmNewPassword) {
    validate(resetPasswordValidation, { newPassword, confirmNewPassword });
    const user = await User.findOne({ confirmationToken: token });
    ensureUserPresence(user);
    user.password = await hashPassword(newPassword);
    user.confirmationToken = undefined;
    await user.save();
}

async function getAllUser({ page = 1, limit = 10, searchQuery = '' }) {
    const currentPage = parseInt(page, 10);
    const usersLimit = parseInt(limit, 10);
    const skip = (currentPage - 1) * usersLimit;
    const users = await User.find({ deleted_at: null, ...buildSearchUser(searchQuery) })
        .skip(skip)
        .limit(usersLimit);

    return { currentPage, usersLimit, users };
}

async function updateUserRole(userId, role) {
    const user = await User.findByIdAndUpdate(userId, { role }, { new: true });
    ensureUserPresence(user);
    return user;
}

async function userData(userId) {
    const user = await User.findById(userId).select('-password');
    ensureUserPresence(user);
    assert(user.deleted_at, "Compte supprimé", 403);
    return user;
}

async function deleteUserByAdmin(userId) {
    const user = await User.findById(userId);
    ensureUserPresence(user);
    user.deleted_at = new Date();
    await user.save();
}

module.exports = {
    registration,
    session,
    confirmUserByToken,
    updateAvatarOptions,
    updateEmail,
    updatePassword,
    forgotPassword,
    resetPassword,
    getAllUser,
    updateUserRole,
    userData,
    deleteUserByAdmin,
};
