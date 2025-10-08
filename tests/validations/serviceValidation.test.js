const { createServiceValidation, updateServiceValidation } = require('../../validations/serviceValidation');
const { expectJoiValidation } = require('../../utils/testing/expectJoiValidation');

describe('Service validation', () => {
    describe('createServiceValidation', () => {
        const schema = createServiceValidation;

        test.each([
            { desc: 'title missing', data: {}, valid: false, expectedMessage: 'Le titre est obligatoire' },
            { desc: 'title too short', data: { title: 'AB' }, valid: false, expectedMessage: 'Le titre doit contenir au moins 3 caractères' },
            { desc: 'title empty', data: { title: '' }, valid: false, expectedMessage: 'Le titre est requis' },
            { desc: 'title too long', data: { title: 'A'.repeat(101) }, valid: false, expectedMessage: 'Le titre doit contenir au maximum 100 caractères' },
            { desc: 'title wrong type', data: { title: 123 }, valid: false, expectedMessage: 'Le titre doit être une chaîne de caractères' },
        ])('$desc', ({ data, valid, expectedMessage }) => {
            expectJoiValidation(schema, data, { valid, expectedMessage });
        });

        test.each([
            { desc: 'content missing', data: { title: 'Service test' }, valid: false, expectedMessage: 'Le contenu est obligatoire' },
            { desc: 'content empty', data: { title: 'Service test', content: "" }, valid: false, expectedMessage: 'Le contenu est requis' },
            { desc: 'content too short', data: { title: 'Service test', content: 'court' }, valid: false, expectedMessage: 'Le contenu doit contenir au moins 10 caractères'},
            { desc: 'content wrong type', data: { title: 'Service test', content: 123 }, valid: false, expectedMessage: 'Le contenu doit être une chaîne de caractères' },

        ])('$desc', ({ data, valid, expectedMessage }) => {
            expectJoiValidation(schema, data, { valid, expectedMessage });
        });

        test.each([
            { desc: 'tags missing', data: { title: 'Service test', content: 'Contenu valide' }, valid: false, expectedMessage: '"tags" is required' },
            { desc: 'tags too many', data: { title: 'Service test', content: 'Contenu valide', tags: ['a', 'b', 'c', 'd', 'e', 'f'] }, valid: false, expectedMessage: 'Seulement 5 tags sont autorisés' },
            { desc: 'tags empty', data: { title: 'Service test', content: 'Contenu valide', tags: [''] }, valid: false, expectedMessage: 'Les tags ne peuvent pas être vides' },
            { desc: 'tags wrong type', data: { title: 'Service test', content: 'Contenu valide', tags: [1, 2] }, valid: false, expectedMessage: "Chaque tag doit être une chaîne de caractères" },
        ])('$desc', ({ data, valid, expectedMessage }) => {
            expectJoiValidation(schema, data, { valid, expectedMessage });
        });

        test.each([
            { desc: 'categoryId wrong type', data: { title: 'Service test', content: 'Contenu valide', tags: ['tag1'], categoryId: 123 }, valid: false, expectedMessage: "La catégorie doit être une chaîne de caractères" },
            { desc: 'categoryId empty', data: { title: 'Service test', content: 'Contenu valide', tags: ['tag1'], categoryId: '' }, valid: false, expectedMessage: 'La catégorie est requise' },
            { desc: 'categoryId missing', data: { title: 'Service test', content: 'Contenu valide', tags: ['tag1'] }, valid: false, expectedMessage: 'La catégorie est obligatoire' },
            { desc: 'categoryId invalid length', data: { title: 'Service test', content: 'Contenu valide', tags: ['tag1'], categoryId: '123' }, valid: false, expectedMessage: 'La catégorie doit être un ObjectId valide' },
            { desc: 'categoryId invalid hex', data: { title: 'Service test', content: 'Contenu valide', tags: ['tag1'], categoryId: 'zzzzzzzzzzzzzzzzzzzzzzzz' }, valid: false, expectedMessage: 'La catégorie doit être un ObjectId hexadécimal' },
        ])('$desc', ({ data, valid, expectedMessage }) => {
            expectJoiValidation(schema, data, { valid, expectedMessage });
        });

        test.each([
            { desc: 'price missing', data: { title: 'Service test', content: 'Contenu valide', tags: ['tag1'], categoryId: '507f1f77bcf86cd799439011' }, valid: false, expectedMessage: 'Le prix est obligatoire' },
            { desc: 'price negative', data: { title: 'Service test', content: 'Contenu valide', tags: ['tag1'], categoryId: '507f1f77bcf86cd799439011', price: -5 }, valid: false, expectedMessage: 'Le prix doit être supérieur ou égal à 0' },
            { desc: 'price wrong type', data: { title: 'Service test', content: 'Contenu valide', tags: ['tag1'], categoryId: '507f1f77bcf86cd799439011', price: 'abc' }, valid: false, expectedMessage: 'Le prix doit être un nombre' },
        ])('$desc', ({ data, valid, expectedMessage }) => {
            expectJoiValidation(schema, data, { valid, expectedMessage });
        });

        test('createServiceValidation valid data', () => {
            const data = {
                title: 'Service complet',
                content: 'Ceci est un contenu valide pour le service.',
                tags: ['tag1', 'tag2'],
                categoryId: '507f1f77bcf86cd799439011',
                price: 99.99,
            };
            const { error, value } = schema.validate(data);
            expect(error).toBeUndefined();
            expect(value).toEqual(expect.objectContaining(data));
        });
    });

    describe('updateServiceValidation', () => {
        const schema = updateServiceValidation;

        test.each([
            { desc: 'all fields optional', data: {}, valid: true },
        ])('$desc', ({ data, valid, expectedMessage }) => {
            expectJoiValidation(schema, data, { valid, expectedMessage });
        });

        test('updateServiceValidation valid', () => {
            const data = {
                title: 'Service complet',
            };
            const { error, value } = schema.validate(data);
            expect(error).toBeUndefined();
            expect(value).toEqual(expect.objectContaining(data));
        });
    });
});
