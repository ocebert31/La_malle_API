const Comment = require('../models/comments');

exports.createComments = async(req, res) => {
    const comment = new Comment({
        content: req.body.content,
        articleId: req.body.articleId,
        userId: req.auth.userId
    });

    comment.save()
    .then(comment => { res.status(200).json({ comment })})
    .catch(error => {res.status(400).json( { error })})
}

exports.getAllComments = (req, res) => {
    const articleId = req.query.articleId;
    Comment.find({ articleId: articleId })
        .then(comments => res.status(200).json(comments))
        .catch(error => res.status(400).json({ error }));
};