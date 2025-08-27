const mongoose = require('mongoose');

const serviceSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true},
  price: { type: Number, required: false, min: 0 },
  imageUrl: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Categories', required: true },
  tags: { type: [String] },
}, {timestamps: true});

module.exports = mongoose.model('Service', serviceSchema);