const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    content: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    articleId: { type: String, required: true}
}, {timestamps: true});

module.exports = mongoose.model('Comment', commentSchema);