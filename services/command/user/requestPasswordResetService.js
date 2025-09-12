const crypto = require('crypto');
const User = require("../../../models/users"); 
const ensureUserPresence = require("../../../utils/validators/ensureUserPresence");
const { sendConfirmationEmail } = require('../../../mail/sendConfirmationEmail');
const { forgotPasswordValidation } = require("../../../validations/userValidation");
const {validate} = require("../../../utils/errorHandler")

async function forgotPassword(email) {
    validate(forgotPasswordValidation, { email });
    const user = await User.findOne({ email });
    ensureUserPresence(user);
    user.confirmationToken = crypto.randomBytes(20).toString('hex');
    await user.save();
    await sendConfirmationEmail(user, 'forgotPassword');
}

module.exports = forgotPassword