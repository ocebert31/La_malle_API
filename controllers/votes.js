const Vote = require('../models/votes');

exports.createVote = async (req, res) => {
    const voteType = req.body.voteType;
    const userId = req.auth.userId;
    const commentId = req.body.commentId || null;
    const articleId = req.body.articleId || null;

    try {
        const existingVote = await Vote.findOne({ 
            userId, 
            $or: [
                { commentId },
                { articleId }
            ]
        });
        if (existingVote) {
            await Vote.deleteOne({ _id: existingVote._id });
            if (existingVote.voteType === voteType) {
                return res.status(200).json({ message: 'Vote supprimé avec succès' });
            } else {
                const vote = new Vote({ userId, commentId, articleId, voteType });
                await vote.save();
                return res.status(200).json({ message: 'Vote changé avec succès', vote });
            }
        } else {
            const vote = new Vote({ userId, commentId, articleId, voteType });
            await vote.save();
            return res.status(201).json({ message: 'Vote enregistré avec succès', vote });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};
