const Comment = require('../models/comments');
const mongoose = require('mongoose');

exports.createComments = async(req, res) => {
    const comment = new Comment({
        content: req.body.content,
        serviceId: req.body.serviceId,
        userId: req.auth.userId,
        commentId: req.body.commentId
    });
    comment.save()
    .then(comment => { res.status(200).json({ comment })})
    .catch(error => {console.error(error),res.status(400).json( { error })})
}

exports.getAllComments = async (req, res) => {
    const serviceId = req.query.serviceId;
    const userId = req.auth && req.auth.userId ? new mongoose.Types.ObjectId(req.auth.userId): null;
    const { page = 1, limit = 20 } = req.query;
    try {
        const currentPage = parseInt(page, 10);
        const commentsLimit = parseInt(limit, 10);
        const comments = await Comment.aggregate([
            {
                $match: { serviceId: serviceId }
            },
            {
                $sort: { createdAt: 1 }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $lookup: {
                    from: 'votes',
                    localField: '_id',
                    foreignField: 'commentId',
                    as: 'votes'
                }
            },
            {
                $unwind: { path: '$user', preserveNullAndEmptyArrays: true }
            },
            {
                $addFields: {
                    upvotes: {
                        $size: {
                            $filter: {
                                input: '$votes',
                                as: 'vote',
                                cond: { $eq: ['$$vote.voteType', 'upvote'] }
                            }
                        }
                    },
                    downvotes: {
                        $size: {
                            $filter: {
                                input: '$votes',
                                as: 'vote',
                                cond: { $eq: ['$$vote.voteType', 'downvote'] }
                            }
                        }
                    },
                    userVotes: userId ? {
                        $let: {
                            vars: {
                                filteredVotes: {
                                    $filter: {
                                        input: '$votes',
                                        as: 'vote',
                                        cond: { $eq: ['$$vote.userId', userId] }
                                    }
                                }
                            },
                            in: {
                                $arrayElemAt: ['$$filteredVotes', 0]
                            }
                        }
                    } : null
                }
            },
            {
                $project: {
                    content: 1,
                    serviceId: 1,
                    userId: 1,
                    commentId: 1,
                    pseudo: '$user.pseudo',
                    createdAt: 1,
                    updatedAt: 1,
                    deletedAt: 1,
                    upvotes: 1,
                    downvotes: 1,
                    userVote: userId ? { voteType: '$userVotes.voteType' } : null,
                    avatarOptions: '$user.avatarOptions'
                }
            },
            { $sort: { createdAt: 1 } },
            { $skip: (currentPage - 1) * commentsLimit },
            { $limit: commentsLimit },
        ]);
        const commentAndReplies = attachRepliesToCommment(comments);
        res.status(200).json(commentAndReplies);
    } catch (error) {
        res.status(400).json({ error });
    }
};

function attachRepliesToCommment(comments) {
    const commentAndReplies = [];
    comments.forEach(comment => {
        if (commentIsReply(comment)) {
            attachReplyToParentComment(commentAndReplies, comment);
        } else {
            commentAndReplies.push(comment);
        }
    });
    return commentAndReplies;
}

function commentIsReply(comment) {
    return comment.commentId;
}

function attachReplyToParentComment(commentAndReplies, reply) {
    for (let comment of commentAndReplies) {
        if (comment._id.toString() === reply.commentId) {
            initReplies(comment);
            comment.replies.push(reply);
        }
    }
}

function initReplies(comment) {
    if (!comment.replies) {
        comment.replies = [];
    }
}

exports.deleteComment = (req, res) => {
    const commentId = req.params.id;

    Comment.findOne({ _id: commentId })
        .then(comment => {
            if (!comment) {
                return res.status(404).json({ message: 'Commentaire non trouvé' });
            }
            if (!hasAccessToComment(comment, req.auth)) {
                return res.status(403).json({ message: 'Requête non autorisée' });
            }

            // Vérifier si le commentaire a des réponses
            Comment.find({ commentId: commentId })
                .then(replies => {
                    Comment.updateOne(
                        { _id: commentId },
                        { deletedAt: new Date()}
                    )
                        .then(() => res.status(200).json({ message: 'Commentaire supprimé' }))
                        .catch(error => res.status(400).json({ error }));
                })
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(400).json({ error }));
};


exports.updateComment = (req, res) => {
    Comment.findOne({ _id: req.params.id })
        .then(comment => {
            if (!comment) {
                return res.status(404).json({ message: 'Commentaire non trouvé' });
            }
            if (!hasAccessToComment(comment, req.auth)) {
                return res.status(403).json({ message: 'Requête non autorisée' });
            }
            const update = {
                content: req.body.content
            };
            Comment.findOneAndUpdate(
                { _id: req.params.id },
                { ...update, _id: req.params.id },
                { new: true }
            )
            .then((updatedComment) => {
                res.status(200).json({ comment: updatedComment });
            })
            .catch((error) => res.status(400).json({ error: error.message }));
        })
        .catch((error) => res.status(500).json({ error: error.message }));
};

function hasAccessToComment(comment, auth) {
    return comment.userId.toString() === auth.userId.toString() || auth.role === 'admin';
}