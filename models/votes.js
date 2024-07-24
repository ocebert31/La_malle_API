const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    commentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', required: true },
    voteType: { type: String, enum: ['upvote', 'downvote'], required: true },
    createdAt: { type: Date, default: Date.now }
});

const Vote = mongoose.model('Vote', voteSchema);

module.exports = Vote;