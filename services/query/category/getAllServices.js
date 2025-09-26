const Category = require('../../../models/categories');

async function getAllServices() {
    return await Category.find();
}

module.exports = getAllServices;