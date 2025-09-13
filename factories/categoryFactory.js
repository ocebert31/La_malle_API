const Category = require("../models/categories")

async function categoryFactory(name, options = { forUpdate: false }) {
    if (!options.forUpdate) {
        return new Category({name}); 
    }
    return {name}; 
}

module.exports = categoryFactory;
