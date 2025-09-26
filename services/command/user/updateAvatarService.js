const User = require("../../../models/users")
const assert = require("../../../validations/assert")

async function updateAvatarService(userId, avatarOptions) {
    const user = await User.findByIdAndUpdate(
        userId,
        { avatarOptions },
        { new: true }
    );
    assert(!user, "Aucun utilisateur n'a été trouvé", 404)
    return user;
}

module.exports = updateAvatarService