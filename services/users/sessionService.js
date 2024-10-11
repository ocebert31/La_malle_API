const User = require("../../models/users");
const jwt = require('jsonwebtoken');
const requiredEmail = require("../../utils/validators/requiredEmail");
const requiredPassword = require("../../utils/validators/requiredPassword");
const confirmPasswordHashMatch = require("../../utils/validators/confirmPasswordHashMatch");
const ensureUserPresence = require("../../utils/validators/ensureUserPresence");

async function sessionService({email, password}) {
    const user = await User.findOne({ email: email });
    requiredEmail(email)
    requiredPassword(password)
    await confirmPasswordHashMatch(password, user)
    ensureUserPresence(user)
    checkConfirmationEmail(user)
    const token = generateToken(user);
    return {user, token};
}

function checkConfirmationEmail(user) {
    if (user.confirmationToken) {
        throw new ValidationError("Veuillez confirmer votre email avant de vous connecter.");
    }
}

function generateToken(user) {
    const token = jwt.sign(
        { userId: user._id, role: user.role, pseudo: user.pseudo },
        process.env.AUTH_TOKEN,
        { expiresIn: '24h' }
    );
    return token;
}

module.exports = sessionService;