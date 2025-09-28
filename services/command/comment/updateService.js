const assert = require("../../../validations/assert")
const Comment = require("../../../models/comments")
const { hasAccessToComment } = require("../../../utils/validators/comment")
const validate = require("../../../validations/validate")
const { updateCommentValidation } = require("../../../validations/commentValidation");

async function updateService(req) {
    const commentId = req.params.id;
    const comment = await Comment.findOne({ _id: commentId  });
    assert(!comment, 404, 'Commentaire non trouvé')
    assert(!hasAccessToComment, 401, 'Requête non autorisée')
    const update = { content: req.body.content };
    validate(updateCommentValidation, update);
    const updatedComment = Comment.findOneAndUpdate(
        { _id: req.params.id },
        { ...update, _id: req.params.id },
        { new: true }
    )
    return updatedComment;
}

module.exports = updateService;