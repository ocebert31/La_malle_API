function hasAccessToComment(comment, auth) {
    return comment.userId.toString() === auth.userId.toString() || auth.role === 'admin';
}

module.exports = { hasAccessToComment };
