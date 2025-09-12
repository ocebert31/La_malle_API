const {validate} = require("../../../utils/errorHandler")
const User = require("../../../models/users")
const ensureUserPresence = require("../../../utils/validators/ensureUserPresence");
const confirmPasswordHashMatch = require("../../../utils/validators/confirmPasswordHashMatch");
const checkExistingUser = require("../../../utils/validators/checkExistingUser");
const { sendConfirmationEmail } = require('../../../mail/sendConfirmationEmail');
const crypto = require('crypto');
const { updateEmailValidation } = require("../../../validations/userValidation");

async function updateEmail(userId, newEmail, currentPassword) {
    validate(updateEmailValidation, { newEmail, currentPassword });
    const user = await User.findById(userId);
    ensureUserPresence(user);
    await confirmPasswordHashMatch(currentPassword, user);
    await checkExistingUser(newEmail);
    user.confirmationToken = crypto.randomBytes(20).toString('hex');
    user.newEmail = newEmail;
    await user.save();
    await sendConfirmationEmail(user, 'update');
}


module.exports = updateEmail