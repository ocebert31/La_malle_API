const assert = require("../../../validations/assert")
const Comment = require("../../../models/comments")
const { hasAccessToComment } = require("../../../utils/validators/comment")

async function deleteService(req) {
    const commentId = req.params.id;
    const comment = await Comment.findOne({ _id: commentId });
    assert(!comment, 404, 'Commentaire non trouvé')
    assert(!hasAccessToComment, 401, 'Requête non autorisée')
    await Comment.find({ commentId: commentId });
    await Comment.updateOne( { _id: commentId }, { deletedAt: new Date() } );
}

module.exports = deleteService;