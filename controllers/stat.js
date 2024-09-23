const Article = require('../models/articles')
const Comment = require('../models/comments')
const User = require('../models/users');

exports.getAllStat = async (req, res) => {
    try {
        const articlesCount = await Article.countDocuments({});
        const commentsCount = await Comment.countDocuments({});
        const usersCount = await User.countDocuments({});
        res.status(200).json({ articlesCount, commentsCount, usersCount});
    } catch (error) {
        res.status(400).json({ error });
    }
};