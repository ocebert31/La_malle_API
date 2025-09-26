const User = require("../../../models/users"); 
const { resetPasswordValidation } = require("../../../validations/userValidation");
const secureHash = require("../../../utils/security/secureHash");
const assert = require("../../../validations/assert")
const validate = require("../../../validations/validate")

async function resetPasswordService(token, newPassword, confirmNewPassword) {
    validate(resetPasswordValidation, { newPassword, confirmNewPassword });
    const user = await User.findOne({ confirmationToken: token });
    assert(!user, "Aucun utilisateur n'a été trouvé", 404)
    user.password = await secureHash(newPassword);
    user.confirmationToken = undefined;
    await user.save();
}

module.exports = resetPasswordService