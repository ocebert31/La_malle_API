const { hasAccessToComment } = require('../../../utils/validators/comment');

describe('hasAccessToComment', () => {
    const testCases = [
        { commentUserId: 1, authUserId: 1, authRole: 'user', expected: true, desc: 'user is owner' },
        { commentUserId: 2, authUserId: 1, authRole: 'admin', expected: true, desc: 'user is admin' },
        { commentUserId: 2, authUserId: 1, authRole: 'user', expected: false, desc: 'user is neither owner nor admin' },
        { commentUserId: '2', authUserId: 2, authRole: 'user', expected: true, desc: 'comment.userId as string, auth.userId as number' },
        { commentUserId: 3, authUserId: '3', authRole: 'user', expected: true, desc: 'comment.userId as number, auth.userId as string' },
    ];

    test.each(testCases)(
        'should return $expected when $desc',
        ({ commentUserId, authUserId, authRole, expected }) => {
            const comment = { userId: commentUserId };
            const auth = { userId: authUserId, role: authRole };
            expect(hasAccessToComment(comment, auth)).toBe(expected);
        }
    );
});
