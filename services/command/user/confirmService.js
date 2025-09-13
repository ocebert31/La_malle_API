const User = require("../../../models/users")
const messages = require("../../../utils/messages/user")
const { assert } = require("../../../utils/errorHandler")

async function confirmUserByToken(token) {
    const user = await User.findOne({ confirmationToken: token });
    assert(!user, "Aucun utilisateur n'a été trouvé", 404)
    const { successMessage, errorMessage } = confirmationMessage(user);
    updateUserForConfirmation(user);
    const result = await saveUser(user);
    return { result, successMessage, errorMessage };
}

function confirmationMessage(user) {
    if (user.email) {
        return {
            successMessage: messages.EMAIL_UPDATE_SUCCESS,
            errorMessage: messages.EMAIL_UPDATE_FAIL
        };
    }
    return {
        successMessage: messages.ACCOUNT_CREATE_SUCCESS,
        errorMessage: messages.ACCOUNT_CREATE_FAIL
    };
}

function updateUserForConfirmation(user) {
    user.email = user.newEmail || user.email;
    user.newEmail = undefined;
    user.confirmationToken = undefined;
}

async function saveUser(user) {
    try {
        await user.save();
        return { success: true, user };
    } catch (error) {
        return { success: false, error };
    }
}

module.exports = confirmUserByToken