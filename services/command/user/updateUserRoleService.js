const User = require("../../../models/users"); 
const assert = require("../../../validations/assert")

async function updateUserRoleService(userId, role) {
    const user = await User.findByIdAndUpdate(userId, { role }, { new: true });
    assert(!user, "Aucun utilisateur n'a été trouvé", 404)
    return user;
}

module.exports = updateUserRoleService;