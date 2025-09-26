const asyncHandler = require("express-async-handler");
const createService = require("../services/command/comment/createService");
const getAllServices = require('../services/query/comment/getAllServices');
const deleteService = require("../services/command/comment/deleteService");
const updateService = require('../services/command/comment/updateService');
const messages = require("../utils/messages/comment")

exports.createComment = asyncHandler(async (req, res) => {
    const comment = await createService(req.body, req.auth);
    res.status(200).json({ comment });
});

exports.getAllComments = asyncHandler(async (req, res) => {
    const commentAndReplies = await getAllServices(req);
    res.status(200).json({ commentAndReplies });
});

exports.deleteComment = asyncHandler(async (req, res) => {
    await deleteService(req);
    res.status(200).json({ message: messages.COMMENT_DELETED });
});

exports.updateComment = asyncHandler(async (req, res) => {
    updatedComment = await updateService(req);
    res.status(200).json({ comment: updatedComment });
});