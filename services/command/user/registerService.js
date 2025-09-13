const {validate} = require("../../../utils/errorHandler")
const {checkExistingUser} = require("../../../utils/validators/user");
const userBuilder = require("../../../factories/user");
const { sendConfirmationEmail } = require('../../../mail/sendConfirmationEmail');
const { registrationValidation } = require("../../../validations/userValidation");

async function registration({ email, password, confirmPassword }) {
    validate(registrationValidation, { email, password, confirmPassword });
    await checkExistingUser(email);
    const user = await userBuilder(password, email);
    await user.save();
    await sendConfirmationEmail(user, 'signup');
    return user;
}

module.exports = registration;