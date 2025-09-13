const {validate, assert} = require("../../../utils/errorHandler")
const User = require("../../../models/users")
const {confirmPasswordHashMatch} = require("../../../utils/validators/user");
const hashPassword = require("../../../utils/utils");
const { updatePasswordValidation } = require("../../../validations/userValidation");

async function updatePassword(userId, currentPassword, newPassword, confirmNewPassword) {
    validate(updatePasswordValidation, { currentPassword, newPassword, confirmNewPassword });
    const user = await User.findById(userId);
    assert(!user, "Aucun utilisateur n'a été trouvé", 404)
    await confirmPasswordHashMatch(currentPassword, user);
    user.password = await hashPassword(newPassword);
    await user.save();
}

module.exports = updatePassword