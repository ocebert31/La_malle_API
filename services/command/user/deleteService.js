const User = require("../../../models/users"); 
const assert = require("../../../validations/assert")

async function deleteService(userId) {
    const user = await User.findById(userId);
    assert(!user, "Aucun utilisateur n'a été trouvé", 404)
    user.deleted_at = new Date();
    await user.save();
}

module.exports = deleteService