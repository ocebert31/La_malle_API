const bcrypt = require('bcrypt');

async function hashPassword(password) {
    const hash = await bcrypt.hash(password, 10);
    return hash;
}

module.exports = hashPassword;