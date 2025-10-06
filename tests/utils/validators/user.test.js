const { checkExistingUser, confirmPasswordHashMatch } = require('../../../utils/validators/user');
const User = require('../../../models/users');
const bcrypt = require('bcrypt');
const assert = require('../../../validations/assert');

jest.mock('../../../models/users');
jest.mock('bcrypt');
jest.mock('../../../validations/assert', () => jest.fn());

describe('User Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const expectAssertCalledWith = (expectedValue, message, code) => {
        expect(assert).toHaveBeenCalledWith(expectedValue, message, code);
    };

    describe('checkExistingUser', () => {
        const testCases = [
            { email: 'existing@example.com', user: { email: 'existing@example.com' }, desc: 'user exists' },
            { email: 'new@example.com', user: null, desc: 'user does not exist' },
            { email: null, user: null, desc: 'email is null' },
            { email: undefined, user: null, desc: 'email is undefined' },
            { email: '', user: null, desc: 'email is empty string' },
        ];

        testCases.forEach(({ email, user, desc }) => {
            test(`should call assert correctly when ${desc}`, async () => {
                User.findOne.mockResolvedValue(user);
                await checkExistingUser(email);
                expect(User.findOne).toHaveBeenCalledWith({
                $or: [{ email }, { newEmail: email }]
                });
                expectAssertCalledWith(user, "Cet email est déjà utilisé", 400);
            });
        });

        test('should propagate error if User.findOne rejects', async () => {
            const email = 'error@example.com';
            const error = new Error('DB error');
            User.findOne.mockRejectedValue(error);
            await expect(checkExistingUser(email)).rejects.toThrow(error);
        });
    });

    describe('confirmPasswordHashMatch', () => {
        const user = { password: 'hashedPassword' };

        const testCases = [
        { password: 'wrongPassword', compareResult: false, desc: 'incorrect password' },
        { password: 'correctPassword', compareResult: true, desc: 'correct password' },
        { password: '', compareResult: false, desc: 'empty password' },
        { password: null, compareResult: false, desc: 'null password' },
        { password: undefined, compareResult: false, desc: 'undefined password' },
        ];

        testCases.forEach(({ password, compareResult, desc }) => {
            test(`should call assert correctly for ${desc}`, async () => {
                bcrypt.compare.mockResolvedValue(compareResult);
                await confirmPasswordHashMatch(password, user);
                expect(bcrypt.compare).toHaveBeenCalledWith(password, user.password);
                expectAssertCalledWith(!compareResult, "Mot de passe incorrect.", 401);
            });
        });

        test('should propagate error if bcrypt.compare rejects', async () => {
            const error = new Error('bcrypt error');
            bcrypt.compare.mockRejectedValue(error);
            await expect(confirmPasswordHashMatch('anyPassword', user)).rejects.toThrow(error);
        });

        test('should handle user with no password', async () => {
            const badUser = {};
            bcrypt.compare.mockResolvedValue(false);
            await confirmPasswordHashMatch('password', badUser);
            expect(bcrypt.compare).toHaveBeenCalledWith('password', undefined);
            expectAssertCalledWith(true, "Mot de passe incorrect.", 401);
        });
    });
});
