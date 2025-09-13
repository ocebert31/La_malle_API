const User = require("../../../models/users"); 
const assert = require("../../../validations/assert")

async function userData(userId) {
    const user = await User.findById(userId).select('-password');
    assert(!user, "Aucun utilisateur n'a été trouvé", 404)
    assert(user.deleted_at, "Compte supprimé", 403);
    return user;
}

module.exports = userData
