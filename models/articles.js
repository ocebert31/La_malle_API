const mongoose = require('mongoose');

const articleSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true},
  imageUrl: { type: String },
});

module.exports = mongoose.model('Article', articleSchema);