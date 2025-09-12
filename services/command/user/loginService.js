const {validate, assert} = require("../../../utils/errorHandler")
const User = require("../../../models/users")
const ensureUserPresence = require("../../../utils/validators/ensureUserPresence");
const confirmPasswordHashMatch = require("../../../utils/validators/confirmPasswordHashMatch");
const { sessionValidation } = require("../../../validations/userValidation");
const jwt = require('jsonwebtoken');

async function session({ email, password }) {
    validate(sessionValidation, { email, password });
    const user = await User.findOne({ email });
    ensureUserPresence(user);
    assert(user.deleted_at, "Compte supprimé", 403);
    await confirmPasswordHashMatch(password, user);
    const token = generateToken(user);
    return { user, token };
}

function generateToken(user) {
    const token = jwt.sign(
        { userId: user._id, role: user.role, pseudo: user.pseudo },
        process.env.AUTH_TOKEN,
        { expiresIn: '24h' }
    );
    return token;
}

module.exports = session