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

exports.getAllArticles = (req, res) => {
    const { page = 1, limit = 20 } = req.query; 
    Article.find()
        .select('title imageUrl')
        .sort({createdAt: -1})
        .skip((page - 1) * limit)
        .limit(limit)
        .then(articles => res.status(200).json(articles))
        .catch(error => res.status(400).json({ error }));
};

exports.getOneArticle =  (req, res) => {
    Article.findOne({ _id: req.params.id })
        .then(article => res.status(200).json(article))
        .catch(error => res.status(404).json({ error }));
}