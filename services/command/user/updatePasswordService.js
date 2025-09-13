const User = require("../../../models/users")
const {confirmPasswordHashMatch} = require("../../../utils/validators/user");
const secureHash = require("../../../utils/security/secureHash");
const { updatePasswordValidation } = require("../../../validations/userValidation");
const assert = require("../../../validations/assert")
const validate = require("../../../validations/validate")

async function updatePassword(userId, currentPassword, newPassword, confirmNewPassword) {
    validate(updatePasswordValidation, { currentPassword, newPassword, confirmNewPassword });
    const user = await User.findById(userId);
    assert(!user, "Aucun utilisateur n'a été trouvé", 404)
    await confirmPasswordHashMatch(currentPassword, user);
    user.password = await secureHash(newPassword);
    await user.save();
}

module.exports = updatePassword