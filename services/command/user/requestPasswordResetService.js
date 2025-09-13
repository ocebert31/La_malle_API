const crypto = require('crypto');
const User = require("../../../models/users"); 
const { sendConfirmationEmail } = require('../../../mail/sendConfirmationEmail');
const { forgotPasswordValidation } = require("../../../validations/userValidation");
const {validate, assert} = require("../../../utils/errorHandler")

async function forgotPassword(email) {
    validate(forgotPasswordValidation, { email });
    const user = await User.findOne({ email });
    assert(!user, "Aucun utilisateur n'a été trouvé", 404)
    user.confirmationToken = crypto.randomBytes(20).toString('hex');
    await user.save();
    await sendConfirmationEmail(user, 'forgotPassword');
}

module.exports = forgotPassword