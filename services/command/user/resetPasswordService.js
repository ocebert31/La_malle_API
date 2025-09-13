const User = require("../../../models/users"); 
const { resetPasswordValidation } = require("../../../validations/userValidation");
const hashPassword = require("../../../utils/utils");
const {validate, assert} = require("../../../utils/errorHandler")

async function resetPassword(token, newPassword, confirmNewPassword) {
    validate(resetPasswordValidation, { newPassword, confirmNewPassword });
    const user = await User.findOne({ confirmationToken: token });
    assert(!user, "Aucun utilisateur n'a été trouvé", 404)
    user.password = await hashPassword(newPassword);
    user.confirmationToken = undefined;
    await user.save();
}

module.exports = resetPassword