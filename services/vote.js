const Vote = require('../models/votes');
const _ = require('lodash');

async function createVote(req, res) {
    const voteType = req.body.voteType;
    const userId = req.auth.userId;
    const commentId = req.body.commentId || null;
    const serviceId = req.body.serviceId || null;
    const voteParams = _.pickBy({ userId, commentId, serviceId }, value => value !== null);
    const paramsForVote = {voteType, userId, commentId, serviceId}
    const existingVote = await Vote.findOne(voteParams);
    await checkUserAlreadyVoted(existingVote, paramsForVote, res)
}

async function checkUserAlreadyVoted(existingVote, paramsForVote, res) {
    if (existingVote) {
        await Vote.deleteOne({ _id: existingVote._id });
        return res.status(200).json({ message: 'Vote supprimé avec succès' });
    } else {
        const vote = new Vote(paramsForVote);
        await vote.save();
        return res.status(201).json({ message: 'Vote enregistré avec succès', vote });
    }
}

module.exports = { createVote }