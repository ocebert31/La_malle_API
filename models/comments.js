const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    content: { type: String, required: true },
    userId: { type: String, required: true},
    articleId: { type: String, required: true}
}, {timestamps: true});

module.exports = mongoose.model('Comment', commentSchema);