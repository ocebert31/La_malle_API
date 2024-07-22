const Article = require('../models/articles')
const fs = require('fs');

exports.createArticle = (req, res) => {
    const imageUrl = req.file ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` : null;
    const article = new Article({
        title: req.body.title,
        content: req.body.content,
        imageUrl,
        userId: req.auth.userId 
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

exports.deleteArticle = (req, res) => {
    const articleId = req.params.id;
    const userId = req.auth.userId; 

    Article.findOne({ _id: articleId })
        .then(article => {
            if (!article) {
                return res.status(404).json({ message: 'Article non trouvé' });
            }
            if (article.userId.toString() !== userId) {
                return res.status(403).json({ message: 'Requête non autorisée' });
            }
            const filename = article.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Article.deleteOne({ _id: articleId })
                    .then(() => res.status(200).json({ message: 'Article supprimé !' }))
            });
        })
};

exports.modifyArticle = (req, res) => {
    const userId = req.auth.userId;

    Article.findOne({ _id: req.params.id })
        .then(article => {
            if (!article) {
                return res.status(404).json({ message: 'Article non trouvé' });
            }
            if (article.userId.toString() !== userId) {
                return res.status(403).json({ message: 'Requête non autorisée' });
            }

            const update = {
                title: req.body.title,
                content: req.body.content
            };
            if (req.file) {
                const oldFilename = article.imageUrl.split('/images/')[1];
                fs.unlink(`images/${oldFilename}`, (err) => {
                    if (err) console.error(err);
                });
                update.imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
            }

            Article.findOneAndUpdate(
                { _id: req.params.id },
                { ...update, _id: req.params.id },
                { new: true }
            )
            .then((updatedArticle) => {
                res.status(200).json({ article: updatedArticle });
            })
            .catch((error) => res.status(400).json({ error: error.message }));
        })
        .catch((error) => res.status(500).json({ error: error.message }));
};

