const { uniqueNamesGenerator, adjectives, colors, animals } = require('unique-names-generator');
const crypto = require('crypto');
const User = require('../../models/users');
const requiredEmail = require("../../utils/validators/requiredEmail");
const requiredPassword = require("../../utils/validators/requiredPassword");
const confirmPasswordMatch = require("../../utils/validators/confirmPasswordMatch");
const passwordTooShort = require("../../utils/validators/passwordTooShort");
const hashPassword = require("../../utils/validators/hashPassword");
const checkExistingUser = require("../../utils/validators/checkExistingUser");
const { sendConfirmationEmail } = require('../../utils/sendConfirmationEmail');

async function registrationService({ email, password, confirmPassword }) {
    requiredEmail(email);
    requiredPassword(password);
    confirmPasswordMatch(password, confirmPassword);
    passwordTooShort(password);
    await checkExistingUser(email)
    const user = await initializeUser(password, email)
    await user.save();
    await sendConfirmationEmail(user, 'signup');
    return user;
}

async function initializeUser(password, email) {
    const pseudo = uniqueNamesGenerator({
        dictionaries: [colors, adjectives, animals],
        length: 3,
        separator: '_'
    });
    const confirmationToken = crypto.randomBytes(20).toString('hex');
    const hashedPassword = await hashPassword(password);
    const user = new User({
        newEmail: email,
        password: hashedPassword,
        pseudo: pseudo,
        confirmationToken,
    });
    return user;
}

module.exports = registrationService;