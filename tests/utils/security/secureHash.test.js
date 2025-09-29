const bcrypt = require('bcrypt');
const secureHash = require('../../../utils/security/secureHash');

jest.mock('bcrypt');

describe('secureHash', () => {
  test('returns a hashed string different from the original value', async () => {
    const value = 'password123';
    const fakeHash = 'hashedPassword123';
    bcrypt.hash.mockResolvedValue(fakeHash);
    const result = await secureHash(value);
    expect(bcrypt.hash).toHaveBeenCalledWith(value, 10);
    expect(result).toBe(fakeHash);
    expect(result).not.toBe(value);
  });
});
