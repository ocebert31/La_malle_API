const Vote = require('../models/votes');
const _ = require('lodash');

exports.createVote = async (req, res) => {
    const voteType = req.body.voteType;
    const userId = req.auth.userId;
    const commentId = req.body.commentId || null;
    const articleId = req.body.articleId || null;
    const voteParams = _.pickBy({ userId, commentId, articleId }, value => value !== null);
    const paramsForVote = {voteType, userId, commentId, articleId}
    try {
        const existingVote = await Vote.findOne(voteParams);
        await checkUserAlreadyVoted(existingVote, paramsForVote, res)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

async function checkUserAlreadyVoted(existingVote, paramsForVote, res) {
    if (existingVote) {
        await handleExistingVote(existingVote, paramsForVote, res)
    } else {
        const vote = new Vote(paramsForVote);
        await vote.save();
        return res.status(201).json({ message: 'Vote enregistré avec succès', vote });
    }
}

async function handleExistingVote(existingVote, paramsForVote, res) {
    await Vote.deleteOne({ _id: existingVote._id });
    if (existingVote.voteType === paramsForVote.voteType) {
        return res.status(200).json({ message: 'Vote supprimé avec succès' });
    } else {
        const vote = new Vote(paramsForVote);
        await vote.save();
        return res.status(200).json({ message: 'Vote changé avec succès', vote });
    }
}