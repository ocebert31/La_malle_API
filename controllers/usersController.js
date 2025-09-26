const asyncHandler = require("express-async-handler");
const messages = require("../utils/messages/user");
const registerService = require("../services/command/user/registerService")
const loginService = require("../services/command/user/loginService")
const confirmService = require("../services/command/user/confirmService")
const updateAvatarService = require("../services/command/user/updateAvatarService")
const updateEmailService = require("../services/command/user/updateEmailService")
const updatePasswordService = require("../services/command/user/updatePasswordService")
const requestPasswordResetService = require("../services/command/user/requestPasswordResetService")
const resetPasswordService = require("../services/command/user/resetPasswordService")
const updateUserRoleService = require("../services/command/user/updateUserRoleService")
const deleteService = require("../services/command/user/deleteService")
const getAllServices = require("../services/query/user/getAllServices")
const getOneService = require("../services/query/user/getOneService")

exports.registration = asyncHandler(async (req, res) => {
    const user = await registerService(req.body);
    res.status(201).json({ message: messages.USER_CREATED, user });
});

exports.session = asyncHandler(async (req, res) => {
    const { user, token } = await loginService(req.body);
    res.status(200).json({ user, token });
});

exports.confirmation = asyncHandler(async (req, res) => {
    const { result, successMessage, errorMessage } = await confirmService(req.params.token);
    if (result.success) {
        res.status(201).json({ message: successMessage, user: result.user });
    } else {
        res.status(500).json({ message: errorMessage, error: result.error.message });
    }
});

exports.updateAvatarOptions = asyncHandler(async (req, res) => {
    const user = await updateAvatarService(req.auth.userId, req.body.avatarOptions);
    res.status(200).json({ message: messages.AVATAR_UPDATED, user });
});

exports.updateEmail = asyncHandler(async (req, res) => {
    await updateEmailService(req.auth.userId, req.body.newEmail, req.body.currentPassword);
    res.status(200).json({ message: messages.EMAIL_CONFIRMATION_SENT });
});

exports.updatePassword = asyncHandler(async (req, res) => {
    await updatePasswordService(req.auth.userId, req.body.currentPassword, req.body.newPassword, req.body.confirmNewPassword);
    res.status(200).json({ message: messages.PASSWORD_UPDATED });
});

exports.forgotPassword = asyncHandler(async (req, res) => {
    await requestPasswordResetService(req.body.email);
    res.status(200).json({ message: messages.PASSWORD_RESET_EMAIL_SENT });
});

exports.resetPassword = asyncHandler(async (req, res) => {
    await resetPasswordService(req.params.token, req.body.newPassword, req.body.confirmNewPassword);
    res.status(200).json({ message: messages.PASSWORD_RESET_SUCCESS });
});

exports.getAllUser = asyncHandler(async (req, res) => {
    const { currentPage, usersLimit, users } = await getAllServices(req.query);
    res.status(200).json({ page: currentPage, limit: usersLimit, users });
});

exports.updateUserRole = asyncHandler(async (req, res) => {
    const user = await updateUserRoleService(req.params.id, req.body.role);
    res.status(200).json(user);
});

exports.userData = asyncHandler(async (req, res) => {
    const user = await getOneService(req.auth.userId);
    res.status(200).json(user);
});

exports.deleteUserByAdmin = asyncHandler(async (req, res) => {
    await deleteService(req.params.id);
    res.status(200).json({ message: messages.USER_DELETED });
});
