const {validate, assert} = require("../../../utils/errorHandler")
const User = require("../../../models/users")
const {confirmPasswordHashMatch} = require("../../../utils/validators/user");
const {checkExistingUser} = require("../../../utils/validators/user");
const { sendConfirmationEmail } = require('../../../mail/sendConfirmationEmail');
const crypto = require('crypto');
const { updateEmailValidation } = require("../../../validations/userValidation");

async function updateEmail(userId, newEmail, currentPassword) {
    validate(updateEmailValidation, { newEmail, currentPassword });
    const user = await User.findById(userId);
    assert(!user, "Aucun utilisateur n'a été trouvé", 404);
    await confirmPasswordHashMatch(currentPassword, user);
    await checkExistingUser(newEmail);
    user.confirmationToken = crypto.randomBytes(20).toString('hex');
    user.newEmail = newEmail;
    await user.save();
    await sendConfirmationEmail(user, 'update');
}


module.exports = updateEmail