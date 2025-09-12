const createService = require("../services/command/vote/createService")
const asyncHandler = require('../middlewares/asyncHandler');

exports.createVote = asyncHandler(async (req, res) => {
    await createService(req, res);
});