const ValidationError = require("./validationError");
const User = require('../../models/users');

async function checkExistingUser(email) {
    const existingUser = await User.findOne({
        $or: [
            { email: email },
            { newEmail: email }
        ]
    });
    if (existingUser) {
        throw new ValidationError("Cet email est déjà utilisé");
    }
}

module.exports = checkExistingUser;