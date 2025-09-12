const User = require("../../../models/users"); 
const ensureUserPresence = require("../../../utils/validators/ensureUserPresence");

async function deleteUserByAdmin(userId) {
    const user = await User.findById(userId);
    ensureUserPresence(user);
    user.deleted_at = new Date();
    await user.save();
}

module.exports = deleteUserByAdmin