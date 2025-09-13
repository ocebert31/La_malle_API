const bcrypt = require('bcrypt');

async function secureHash(value) {
    const hash = await bcrypt.hash(value, 10);
    return hash;
}

module.exports = secureHash;