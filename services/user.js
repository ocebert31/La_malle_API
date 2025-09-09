const checkExistingUser = require("../utils/validators/checkExistingUser");
const { sendConfirmationEmail } = require('../utils/sendConfirmationEmail');
const { registrationSchema, sessionSchema, updateEmailSchema, updatePasswordSchema, forgotPasswordSchema, resetPasswordSchema } = require("../utils/validators/userSchema")
const createUser = require("../factories/user")
const User = require("../models/users");
const crypto = require('crypto');
const assert = require("../utils/errorHandler")
const hashPassword = require("../utils/validators/hashPassword");
const confirmPasswordHashMatch = require("../utils/validators/confirmPasswordHashMatch");
const ensureUserPresence = require("../utils/validators/ensureUserPresence");
const { checkConfirmationEmail, generateToken, confirmationMessage, updateUserForConfirmation, saveUser, sendResponseForConfirmation, buildSearchUser} = require("../utils/user")

async function registrationService({ email, password, confirmPassword }) {
    const { error } = registrationSchema.validate({ email, password, confirmPassword });
    assert(error, error?.details?.[0].message, 400)
    await checkExistingUser(email)
    const user = await createUser(password, email)
    await user.save();
    await sendConfirmationEmail(user, 'signup');
    return user;
}

async function sessionService({ email, password }) {
    const { error } = sessionSchema.validate({ email, password });
    assert(error, error?.details?.[0]?.message, 400);
    const user = await User.findOne({ email });
    assert(!user, "Utilisateur inexistant", 404);
    assert(user.deleted_at, "Compte supprimé", 403);
    await confirmPasswordHashMatch(password, user);
    ensureUserPresence(user);
    checkConfirmationEmail(user);
    const token = generateToken(user);
    return { user, token };
}

async function confirmUserByToken(req, res) {
    const { token } = req.params;
    const user = await User.findOne({ confirmationToken: token });
    ensureUserPresence(user);
    const { successMessage, errorMessage } = confirmationMessage(user);
    updateUserForConfirmation(user);
    const result = await saveUser(user);
    sendResponseForConfirmation(res, result, successMessage, errorMessage);
}

async function updateAvatarOptions(req) {
    const userId = req.auth.userId;
    const { avatarOptions } = req.body;
     const user = await User.findByIdAndUpdate(
        userId,
        { avatarOptions },
        { new: true }
    );
    ensureUserPresence(user);  
    return user;
}

async function updateEmail(req) {
    const { newEmail, currentPassword } = req.body;
    const { error } = updateEmailSchema.validate({ newEmail, currentPassword });
    assert(error, error?.details?.[0]?.message, 400);
    const user = await User.findById(req.auth.userId);
    await confirmPasswordHashMatch(currentPassword, user)
    await checkExistingUser(newEmail)
    user.confirmationToken = crypto.randomBytes(20).toString('hex');
    user.newEmail = newEmail;
    await user.save();
    await sendConfirmationEmail(user, 'update');
}

async function updatePassword(req, res) {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;
    const { error } = updatePasswordSchema.validate({ currentPassword, newPassword, confirmNewPassword });
    assert(error, error?.details?.[0]?.message, 400);
    const user = await User.findById(req.auth.userId);
    ensureUserPresence(user);
    await confirmPasswordHashMatch(currentPassword, user, res)
    const hashedPassword = await hashPassword(newPassword);
    user.password = hashedPassword;
    await user.save();
}

async function forgotPassword(req) {
    const { email } = req.body;
    const { error } = forgotPasswordSchema.validate({ email });
    assert(error, error?.details?.[0]?.message, 400);
    const user = await User.findOne({ email});
    ensureUserPresence(user);
    user.confirmationToken = crypto.randomBytes(20).toString('hex');
    await user.save();
    await sendConfirmationEmail(user, 'forgotPassword');
}

async function resetPassword(req) {
    const { token } = req.params;
    const { newPassword, confirmNewPassword } = req.body;
    const { error } = resetPasswordSchema.validate({ newPassword, confirmNewPassword });
    assert(error, error?.details?.[0]?.message, 400);
    const user = await User.findOne({ confirmationToken: token });
    ensureUserPresence(user);
    const hashedPassword = await hashPassword(newPassword);
    user.password = hashedPassword;
    user.confirmationToken = undefined;
    await user.save();
}

async function getAllUser(req) {
    const { page = 1, limit = 10, searchQuery = '' } = req.query;
    const currentPage = parseInt(page, 10);
    const usersLimit = parseInt(limit, 10);
    const skip = (currentPage - 1) * usersLimit;
    const users = await User.find({deleted_at: null, ...buildSearchUser(searchQuery)})
        .skip(skip)
        .limit(usersLimit);
    return { currentPage, usersLimit, users}
}

async function updateUserRole(req) {
    const { id } = req.params;
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(id, { role }, { new: true });
    ensureUserPresence(user);
    return { user };
}

module.exports = { registrationService, sessionService, confirmUserByToken, updateAvatarOptions, updateEmail, updatePassword, forgotPassword, resetPassword, getAllUser, updateUserRole };