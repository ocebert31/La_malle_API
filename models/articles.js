const mongoose = require('mongoose');

const articleSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true},
  imageUrl: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Categories', required: true },
  tags: { type: [String] },
}, {timestamps: true});

module.exports = mongoose.model('Article', articleSchema);