const mongoose = require('mongoose');

const categoriesSchema = mongoose.Schema({
  name: { type: String, required: true },
}, {timestamps: true});

module.exports = mongoose.model('Categories', categoriesSchema);