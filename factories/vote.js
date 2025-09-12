async function voteFactory({ userId, voteType, commentId = null, serviceId = null }) {
    const voteData = { userId, voteType };
    if (commentId) voteData.commentId = commentId;
    if (serviceId) voteData.serviceId = serviceId;
    return voteData;
}

module.exports = voteFactory;
