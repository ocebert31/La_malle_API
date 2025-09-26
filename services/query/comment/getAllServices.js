const mongoose = require('mongoose');
const Comment = require('../../../models/comments');

async function getAllServices(req) {
    const serviceId = req.query.serviceId;
    const userId = req.auth && req.auth.userId ? new mongoose.Types.ObjectId(req.auth.userId): null;
    const { page = 1, limit = 20 } = req.query;
    const comments = await buildAllServicesAggregation(serviceId, userId, page, limit);
    const commentAndReplies = organizeCommentsWithReplies(comments);
    return commentAndReplies
};

async function buildAllServicesAggregation(serviceId, userId, page, limit) {
    const currentPage = parseInt(page, 10);
    const commentsLimit = parseInt(limit, 10);
    const aggregationServicesSteps = [
        { $match: { serviceId: serviceId } },
        { $sort: { createdAt: 1 } },
        { $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'user' } },
        { $lookup: { from: 'votes', localField: '_id', foreignField: 'commentId', as: 'votes' } },
        { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
        { $addFields: {
                upvotes: { $size: { $filter: { input: '$votes', as: 'vote', cond: { $eq: ['$$vote.voteType', 'upvote'] } } } },
                downvotes: { $size: { $filter: { input: '$votes', as: 'vote', cond: { $eq: ['$$vote.voteType', 'downvote'] } } } },
                userVotes: userId ? { $let: { vars: { filteredVotes: { $filter: { input: '$votes', as: 'vote', cond: { $eq: ['$$vote.userId', userId] } } } },
                in: { $arrayElemAt: ['$$filteredVotes', 0] } } } : null
            }
        },
        { $project: { content: 1, serviceId: 1, userId: 1, commentId: 1, pseudo: '$user.pseudo', createdAt: 1, updatedAt: 1, deletedAt: 1, upvotes: 1, downvotes: 1, userVote: userId ? { voteType: '$userVotes.voteType' } : null, avatarOptions: '$user.avatarOptions' } },
        { $sort: { createdAt: 1 } },
        { $skip: (currentPage - 1) * commentsLimit },
        { $limit: commentsLimit },
    ];
    return Comment.aggregate(aggregationServicesSteps);
}

function organizeCommentsWithReplies(comments) {
    const commentsWithReplies  = [];
    comments.forEach(comment => {
        if (isReply(comment)) {
            addReplyToParent(commentsWithReplies, comment);
        } else {
            commentsWithReplies.push(comment);
        }
    });
    return commentsWithReplies;
}

function isReply(comment) {
    return comment.commentId;
}

function addReplyToParent(commentsWithReplies, reply) {
    for (let comment of commentsWithReplies) {
        if (comment._id.toString() === reply.commentId) {
            ensureRepliesArray(comment);
            comment.replies.push(reply);
        }
    }
}

function ensureRepliesArray(comment) {
    if (!comment.replies) {
        comment.replies = [];
    }
}

module.exports = getAllServices

























