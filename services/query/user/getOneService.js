const User = require("../../../models/users"); 
const ensureUserPresence = require("../../../utils/validators/ensureUserPresence");
const { assert} = require("../../../utils/errorHandler")

async function userData(userId) {
    const user = await User.findById(userId).select('-password');
    ensureUserPresence(user);
    assert(user.deleted_at, "Compte supprimé", 403);
    return user;
}

module.exports = userData
