const voteService = require("../services/vote")

exports.createVote = async (req, res) => {
    await voteService.createVote(req, res);
};
