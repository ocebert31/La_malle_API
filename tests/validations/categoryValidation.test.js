const { createCategoryValidation, updateCategoryValidation } = require('../../validations/categoryValidation');
const { expectJoiValidation } = require('../../utils/testing/expectJoiValidation');

describe('Category validation', () => {
  const testCases = [
    { schema: createCategoryValidation, desc: 'create: name empty', data: { name: '' }, valid: false, expectedMessage: 'Le nom de la catégorie est requis' },
    { schema: createCategoryValidation, desc: 'create: name too short', data: { name: 'A' }, valid: false, expectedMessage: 'Le nom de la catégorie doit contenir au moins 2 caractères' },
    { schema: createCategoryValidation, desc: 'create: valid name', data: { name: 'Valid Name' }, valid: true },

    { schema: updateCategoryValidation, desc: 'update: name too short', data: { name: 'A' }, valid: false, expectedMessage: 'Le nom de la catégorie doit contenir au moins 2 caractères' },
    { schema: updateCategoryValidation, desc: 'update: valid name', data: { name: 'Valid Name' }, valid: true },
    { schema: updateCategoryValidation, desc: 'update: name omitted', data: {}, valid: true },
  ];

  test.each(testCases)('$desc', ({ schema, data, valid, expectedMessage }) => {
    expectJoiValidation(schema, data, { valid, expectedMessage });
  });
});

