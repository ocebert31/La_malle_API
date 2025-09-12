const User = require("../../../models/users")
const ensureUserPresence = require("../../../utils/validators/ensureUserPresence");

async function updateAvatarOptions(userId, avatarOptions) {
    const user = await User.findByIdAndUpdate(
        userId,
        { avatarOptions },
        { new: true }
    );
    ensureUserPresence(user);
    return user;
}

module.exports = updateAvatarOptions