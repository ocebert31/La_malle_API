const Comment = require("../models/comments")

async function commentFactory(data, auth) {
    const commentData = {
        content: data.content,
        serviceId: data.serviceId,
        userId: auth.userId,
        commentId: data.commentId
    };
    return new Comment(commentData);
}

module.exports = commentFactory;