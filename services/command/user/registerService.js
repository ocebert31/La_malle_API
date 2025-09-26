const validate = require("../../../validations/validate")
const {checkExistingUser} = require("../../../utils/validators/user");
const userFactory = require("../../../factories/userFactory");
const sendConfirmationEmail = require('./sendConfirmationEmailService');
const { registrationValidation } = require("../../../validations/userValidation");

async function registerService({ email, password, confirmPassword }) {
    validate(registrationValidation, { email, password, confirmPassword });
    await checkExistingUser(email);
    const user = await userFactory(password, email);
    await user.save();
    await sendConfirmationEmail(user, 'signup');
    return user;
}

module.exports = registerService;