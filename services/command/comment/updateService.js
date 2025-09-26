const assert = require("../../../validations/assert")
const Comment = require("../../../models/comments")
const { hasAccessToComment } = require("../../../utils/validators/comment")

async function updateService(req) {
    const comment = await Comment.findOne({ _id: req.params.id  });
    assert(!comment, 404, 'Commentaire non trouvé')
    assert(!hasAccessToComment, 401, 'Requête non autorisée')
    const update = { content: req.body.content };
    const updatedComment = Comment.findOneAndUpdate(
        { _id: req.params.id },
        { ...update, _id: req.params.id },
        { new: true }
    )
    return updatedComment;
}

module.exports = updateService;