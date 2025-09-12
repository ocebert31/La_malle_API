const User = require("../../../models/users"); 

async function getAllUser({ page = 1, limit = 10, searchQuery = '' }) {
    const currentPage = parseInt(page, 10);
    const usersLimit = parseInt(limit, 10);
    const skip = (currentPage - 1) * usersLimit;
    const users = await User.find({ deleted_at: null, ...buildSearchUser(searchQuery) })
        .skip(skip)
        .limit(usersLimit);

    return { currentPage, usersLimit, users };
}

function buildSearchUser(searchQuery) {
    const searchFilter = searchQuery
        ? { $or: [ 
            { pseudo: { $regex: searchQuery, $options: 'i' } }, 
            { email: { $regex: searchQuery, $options: 'i' } }
          ] }
        : {};
    return searchFilter
}

module.exports = getAllUser