const crypto = require('crypto');
const User = require("../models/users");
const createUser = require("../factories/user");
const checkExistingUser = require("../utils/validators/checkExistingUser");
const confirmPasswordHashMatch = require("../utils/validators/confirmPasswordHashMatch");
const ensureUserPresence = require("../utils/validators/ensureUserPresence");
const { sendConfirmationEmail } = require('../mail/sendConfirmationEmail');
const { registrationSchema, sessionSchema, updateEmailSchema, updatePasswordSchema, 
    forgotPasswordSchema, resetPasswordSchema } = require("../validations/userSchema");
const {  checkConfirmationEmail, generateToken, confirmationMessage, updateUserForConfirmation, 
    saveUser, buildSearchUser, hashPassword } = require("../utils/user");
const {validate, assert} = require("../utils/errorHandler")

async function registration({ email, password, confirmPassword }) {
    validate(registrationSchema, { email, password, confirmPassword });
    await checkExistingUser(email);
    const user = await createUser(password, email);
    await user.save();
    await sendConfirmationEmail(user, 'signup');
    return user;
}

async function session({ email, password }) {
    validate(sessionSchema, { email, password });
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
    validate(updateEmailSchema, { newEmail, currentPassword });
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
    validate(updatePasswordSchema, { currentPassword, newPassword, confirmNewPassword });
    const user = await User.findById(userId);
    ensureUserPresence(user);
    await confirmPasswordHashMatch(currentPassword, user);
    user.password = await hashPassword(newPassword);
    await user.save();
}

async function forgotPassword(email) {
    validate(forgotPasswordSchema, { email });
    const user = await User.findOne({ email });
    ensureUserPresence(user);
    user.confirmationToken = crypto.randomBytes(20).toString('hex');
    await user.save();
    await sendConfirmationEmail(user, 'forgotPassword');
}

async function resetPassword(token, newPassword, confirmNewPassword) {
    validate(resetPasswordSchema, { newPassword, confirmNewPassword });
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
