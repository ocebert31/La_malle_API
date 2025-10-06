const validate = require('../../validations/validate');
const assert = require('../../validations/assert');

jest.mock('../../validations/assert');

describe('validate', () => {
    afterEach(() => jest.clearAllMocks());

    const mockSchema = (error = null) => ({
        validate: jest.fn(() => ({ error })),
    });

    const testCases = [
        {
            desc: 'validation passes (no error)',
            schema: mockSchema(null),
            data: { name: 'John' },
            customMessage: null,
            statusCode: 400,
            shouldCallAssert: false,
            expectedMessage: null,
            expectedCode: null,
        },
        {
            desc: 'validation fails with default message',
            schema: mockSchema({ details: [{ message: 'Invalid name' }] }),
            data: { name: '' },
            customMessage: null,
            statusCode: 400,
            shouldCallAssert: true,
            expectedMessage: 'Invalid name',
            expectedCode: 400,
        },
        {
            desc: 'validation fails with custom message and custom code',
            schema: mockSchema({ details: [{ message: 'Invalid email' }] }),
            data: { email: 'abc' },
            customMessage: 'Custom error',
            statusCode: 422,
            shouldCallAssert: true,
            expectedMessage: 'Custom error',
            expectedCode: 422,
        },
    ];

    test.each(testCases)('$desc', ({ schema, data, customMessage, statusCode, shouldCallAssert, expectedMessage, expectedCode }) => {
        validate(schema, data, customMessage, statusCode);
        if (shouldCallAssert) {
            expect(assert).toHaveBeenCalledTimes(1);
            expect(assert).toHaveBeenCalledWith(true, expectedMessage, expectedCode);
        } else {
            expect(assert).not.toHaveBeenCalled();
        }
    });
});
