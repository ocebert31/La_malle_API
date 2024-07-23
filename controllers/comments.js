const Comment = require('../models/comments');

exports.createComments = async(req, res) => {
    const comment = new Comment({
        content: req.body.content,
        articleId: req.body.articleId,
        userId: req.auth.userId
    });

    comment.save()
    .then(comment => { res.status(200).json({ comment })})
    .catch(error => {console.error(error),res.status(400).json( { error })})
}

exports.getAllComments = async (req, res) => {
    const articleId = req.query.articleId;
    try {
        const comments = await Comment.aggregate([
            {
                $match: { articleId: articleId }
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
                $unwind: { path: '$user', preserveNullAndEmptyArrays: true }
            },
            {
                $project: {
                    content: 1,
                    articleId: 1,
                    pseudo: '$user.pseudo',
                    createdAt: 1,
                    updatedAt: 1
                }
            }
        ]);
        res.status(200).json(comments);
    } catch (error) {
        res.status(400).json({ error });
    }
};