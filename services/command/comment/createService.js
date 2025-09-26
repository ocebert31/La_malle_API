const commentFactory = require('../../../factories/commentFactory');

async function createService(data, auth) {
    const newComment = await commentFactory(data, auth);
    await newComment.save();
    return newComment;
}

module.exports = createService;