const createService = require("../services/command/favorite/createService")
const asyncHandler = require("express-async-handler");

exports.createFavoriteService =  asyncHandler(async (req, res) => {
    await createService(req, res);
});