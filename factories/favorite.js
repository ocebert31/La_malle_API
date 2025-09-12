const Favorite = require("../models/favorites");

async function favoriteFactory({ userId, serviceId }) {
    return new Favorite({ userId, serviceId })
}

module.exports = favoriteFactory;
