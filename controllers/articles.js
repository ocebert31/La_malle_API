const Article = require('../models/articles')

exports.createArticle = (req, res) => {
    const imageUrl = req.file ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` : null;
    const article = new Article({
        title: req.body.title,
        content: req.body.content,
        imageUrl
    });
    article.save()
    .then(article => { res.status(200).json({ article })})
    .catch(error => { res.status(400).json( { error })})
};