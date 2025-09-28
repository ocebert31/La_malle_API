const commentFactory = require('../../../factories/commentFactory');
const validate = require("../../../validations/validate")
const { createCommentValidation } = require("../../../validations/commentValidation");

async function createService(data, auth) {
    validate(createCommentValidation, { content: data.content });
    const newComment = await commentFactory(data, auth);
    await newComment.save();
    return newComment;
}

module.exports = createService;