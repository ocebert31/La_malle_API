const bcrypt = require('bcrypt');
const secureHash = require('../../../utils/security/secureHash');

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
}));

describe('secureHash (unit test with mocked bcrypt)', () => {
  const passwords = ['password123', 'helloWorld!', '123456'];

  beforeEach(() => {
    bcrypt.hash.mockClear();
  });

  test.each(passwords)('should call bcrypt.hash and return the hash for "%s"', async (password) => {
    const fakeHash = `hashed-${password}`;
    bcrypt.hash.mockResolvedValue(fakeHash);
    const hash = await secureHash(password);
    expect(bcrypt.hash).toHaveBeenCalledTimes(1);
    expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
    expect(hash).toBe(fakeHash);
  });
});
