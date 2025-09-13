const createService = require("../services/command/vote/createService")
const asyncHandler = require("express-async-handler");

exports.createVote = asyncHandler(async (req, res) => {
    await createService(req, res);
});