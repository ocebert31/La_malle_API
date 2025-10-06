const assert = require('../../validations/assert');

describe('assert', () => {
  const cases = [
    { context: true, message: 'Error occurred', code: 400, shouldThrow: true, desc: 'context is true' },
    { context: 1, message: 'Numeric true', code: 401, shouldThrow: true, desc: 'context is truthy number' },
    { context: 'non-empty', message: 'String true', code: 402, shouldThrow: true, desc: 'context is non-empty string' },
    { context: false, message: 'No error', code: 400, shouldThrow: false, desc: 'context is false' },
    { context: 0, message: 'No error', code: 400, shouldThrow: false, desc: 'context is zero' },
    { context: '', message: 'No error', code: 400, shouldThrow: false, desc: 'context is empty string' },
    { context: null, message: 'No error', code: 400, shouldThrow: false, desc: 'context is null' },
    { context: undefined, message: 'No error', code: 400, shouldThrow: false, desc: 'context is undefined' },
  ];

    test.each(cases)('$desc → should $shouldThrow ? throw : not throw', ({ context, message, code, shouldThrow }) => {
        if (shouldThrow) {
            const fn = () => assert(context, message, code);
            expect(fn).toThrow(message);
            try {
                fn();
            } catch (err) {
                expect(err.status).toBe(code);
            }
        } else {
            expect(() => assert(context, message, code)).not.toThrow();
        }
    });
});
