const Vote = require('../../../models/votes');
const voteFactory = require('../../../factories/vote');

async function createVote(req, res) {
    const voteType = req.body.voteType;
    const userId = req.auth.userId;
    const commentId = req.body.commentId || null;
    const serviceId = req.body.serviceId || null;

    const voteData = await voteFactory({ userId, voteType, commentId, serviceId });
    const query = buildVoteQuery({ userId, commentId, serviceId });
    const existingVote = await Vote.findOne(query);

    let result;
    if (!existingVote) result = await addVote(voteData);
    else if (existingVote.voteType === voteType) result = await deleteVote(existingVote);
    else result = await switchVote(existingVote, voteData);

    return res.status(200).json(result); 
}

function buildVoteQuery({ userId, commentId, serviceId }) {
    const query = { userId };
    if (commentId) query.commentId = commentId;
    if (serviceId) query.serviceId = serviceId;
    return query;
}

async function addVote(voteData) {
    const vote = new Vote(voteData);
    await vote.save();
    return { action: 'created', message: 'Vote enregistré avec succès', vote };
}

async function deleteVote(vote) {
    await Vote.deleteOne({ _id: vote._id });
    return { action: 'deleted', message: 'Vote supprimé avec succès' };
}

async function switchVote(existingVote, voteData) {
    existingVote.voteType = voteData.voteType;
    await existingVote.save();
    return { action: 'switched', message: 'Vote modifié avec succès', vote: existingVote };
}

module.exports = createVote;
