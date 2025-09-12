const {validate} = require("../../../utils/errorHandler")
const User = require("../../../models/users")
const ensureUserPresence = require("../../../utils/validators/ensureUserPresence");
const confirmPasswordHashMatch = require("../../../utils/validators/confirmPasswordHashMatch");
const hashPassword = require("../../../utils/utils");
const { updatePasswordValidation } = require("../../../validations/userValidation");

async function updatePassword(userId, currentPassword, newPassword, confirmNewPassword) {
    validate(updatePasswordValidation, { currentPassword, newPassword, confirmNewPassword });
    const user = await User.findById(userId);
    ensureUserPresence(user);
    await confirmPasswordHashMatch(currentPassword, user);
    user.password = await hashPassword(newPassword);
    await user.save();
}

module.exports = updatePassword