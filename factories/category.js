const Category = require("../models/categories")

async function categoryBuilder(name, options = { forUpdate: false }) {
    if (!options.forUpdate) {
        return new Category({name}); 
    }
    return {name}; 
}

module.exports = categoryBuilder;
