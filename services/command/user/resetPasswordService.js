const User = require("../../../models/users"); 
const ensureUserPresence = require("../../../utils/validators/ensureUserPresence");
const { resetPasswordValidation } = require("../../../validations/userValidation");
const hashPassword = require("../../../utils/utils");
const {validate} = require("../../../utils/errorHandler")

async function resetPassword(token, newPassword, confirmNewPassword) {
    validate(resetPasswordValidation, { newPassword, confirmNewPassword });
    const user = await User.findOne({ confirmationToken: token });
    ensureUserPresence(user);
    user.password = await hashPassword(newPassword);
    user.confirmationToken = undefined;
    await user.save();
}

module.exports = resetPassword