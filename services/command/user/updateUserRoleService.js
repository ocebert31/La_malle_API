const User = require("../../../models/users"); 
const ensureUserPresence = require("../../../utils/validators/ensureUserPresence");

async function updateUserRole(userId, role) {
    const user = await User.findByIdAndUpdate(userId, { role }, { new: true });
    ensureUserPresence(user);
    return user;
}

module.exports = updateUserRole;