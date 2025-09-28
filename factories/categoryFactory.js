const Category = require("../models/categories");

async function categoryFactory(name, options = { forUpdate: false }) {
    if (!options.forUpdate) {
        return new Category({ name });
    }
    const updateData = {};
    if (name !== undefined) {
        updateData.name = name;
    }
    return updateData;
}

module.exports = categoryFactory;
