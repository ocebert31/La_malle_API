const crypto = require('crypto');
const User = require("../../../models/users"); 
const { forgotPasswordValidation } = require("../../../validations/userValidation");
const assert = require("../../../validations/assert")
const validate = require("../../../validations/validate")
const sendResetPasswordService = require("./sendResetPasswordService")

async function requestPasswordResetService(email) {
    validate(forgotPasswordValidation, { email });
    const user = await User.findOne({ email });
    assert(!user, "Aucun utilisateur n'a été trouvé", 404)
    user.confirmationToken = crypto.randomBytes(20).toString('hex');
    await user.save();
    await sendResetPasswordService(user);
}

module.exports = requestPasswordResetService;