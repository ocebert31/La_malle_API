function expectJoiValidation(schema, data, { valid = true, expectedMessage = null } = {}) {
  const { error } = schema.validate(data);

  if (valid) {
    expect(error).toBeUndefined();
  } else {
    expect(error).toBeDefined();
    expect(error.details[0].message).toBe(expectedMessage);
  }
}

module.exports = { expectJoiValidation }