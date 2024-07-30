const mongoose = require('mongoose');

const favoriteSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  articleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Article', required: true },
}, {timestamps: true});

module.exports = mongoose.model('Favorite', favoriteSchema);