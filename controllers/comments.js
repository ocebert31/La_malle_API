const Comment = require('../models/comments');
const mongoose = require('mongoose');

exports.createComments = async(req, res) => {
    const comment = new Comment({
        content: req.body.content,
        articleId: req.body.articleId,
        userId: req.auth.userId,
        commentId: req.body.commentId
    });
    console.log(req)
    comment.save()
    .then(comment => { res.status(200).json({ comment })})
    .catch(error => {console.error(error),res.status(400).json( { error })})
}

exports.getAllComments = async (req, res) => {
    const articleId = req.query.articleId;
    const userId = req.auth && req.auth.userId ? new mongoose.Types.ObjectId(req.auth.userId): null;
    try {
        const comments = await Comment.aggregate([
            {
                $match: { articleId: articleId }
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
                    articleId: 1,
                    userId: 1,
                    commentId: 1,
                    pseudo: '$user.pseudo',
                    createdAt: 1,
                    updatedAt: 1,
                    deletedAt: 1,
                    upvotes: 1,
                    downvotes: 1,
                    userVote: userId ? { voteType: '$userVotes.voteType' } : null,
                }
            }
        ]);
        res.status(200).json(comments);
    } catch (error) {
        res.status(400).json({ error });
    }
};

// exports.deleteComment = (req, res) => {
//     const commentId = req.params.id;
//     Comment.findOne({ _id: commentId })
//         .then(comment => {
//             if (!comment) {
//                 return res.status(404).json({ message: 'Commentaire non trouvé' });
//             }
//             if (!hasAccessToComment(comment, req.auth)) {
//                 return res.status(403).json({ message: 'Requête non autorisée' });
//             }
//             Comment.deleteOne({ _id: commentId })
//                 .then(() => res.status(200).json({ message: 'Commentaire supprimé !' }))
//                 .catch(error => res.status(400).json({ error }));
//         })
//         .catch(error => res.status(400).json({ error }));
// };

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
    return comment.userId.toString() === auth.userId || auth.role === 'admin';
}