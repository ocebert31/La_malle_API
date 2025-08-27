const mongoose = require('mongoose');

const favoriteSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
}, {timestamps: true});

module.exports = mongoose.model('Favorite', favoriteSchema);