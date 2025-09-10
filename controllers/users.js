const asyncHandler = require('../middlewares/asyncHandler');
const messages = require("../utils/messages/user");
const userService = require("../services/user");

exports.registration = asyncHandler(async (req, res) => {
    const user = await userService.registration(req.body);
    res.status(201).json({ message: messages.USER_CREATED, user });
});

exports.session = asyncHandler(async (req, res) => {
    const { user, token } = await userService.session(req.body);
    res.status(200).json({ user, token });
});

exports.confirmation = asyncHandler(async (req, res) => {
    const { result, successMessage, errorMessage } = await userService.confirmUserByToken(req.params.token);
    if (result.success) {
        res.status(201).json({ message: successMessage, user: result.user });
    } else {
        res.status(500).json({ message: errorMessage, error: result.error.message });
    }
});

exports.updateAvatarOptions = asyncHandler(async (req, res) => {
    const user = await userService.updateAvatarOptions(req.auth.userId, req.body.avatarOptions);
    res.status(200).json({ message: 'Options d\'avatar mises à jour', user });
});

exports.updateEmail = asyncHandler(async (req, res) => {
    await userService.updateEmail(req.auth.userId, req.body.newEmail, req.body.currentPassword);
    res.status(200).json({ message: messages.EMAIL_CONFIRMATION_SENT });
});

exports.updatePassword = asyncHandler(async (req, res) => {
    await userService.updatePassword(req.auth.userId, req.body.currentPassword, req.body.newPassword, req.body.confirmNewPassword);
    res.status(200).json({ message: messages.PASSWORD_UPDATED });
});

exports.forgotPassword = asyncHandler(async (req, res) => {
    await userService.forgotPassword(req.body.email);
    res.status(200).json({ message: messages.PASSWORD_RESET_EMAIL_SENT });
});

exports.resetPassword = asyncHandler(async (req, res) => {
    await userService.resetPassword(req.params.token, req.body.newPassword, req.body.confirmNewPassword);
    res.status(200).json({ message: messages.PASSWORD_RESET_SUCCESS });
});

exports.getAllUser = asyncHandler(async (req, res) => {
    const { currentPage, usersLimit, users } = await userService.getAllUser(req.query);
    res.status(200).json({ page: currentPage, limit: usersLimit, users });
});

exports.updateUserRole = asyncHandler(async (req, res) => {
    const user = await userService.updateUserRole(req.params.id, req.body.role);
    res.status(200).json(user);
});

exports.userData = asyncHandler(async (req, res) => {
    const user = await userService.userData(req.auth.userId);
    res.status(200).json(user);
});

exports.deleteUserByAdmin = asyncHandler(async (req, res) => {
    await userService.deleteUserByAdmin(req.params.id);
    res.status(200).json({ message: messages.USER_DELETED });
});
