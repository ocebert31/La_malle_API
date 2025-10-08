const { createCommentValidation, updateCommentValidation } = require('../../validations/commentValidation');
const { expectJoiValidation } = require('../../utils/testing/expectJoiValidation');

describe('Comment validation', () => {
    const testCases = [
        { schema: createCommentValidation, desc: 'create: content empty', data: { content: '' }, valid: false, expectedMessage: 'Le contenu du commentaire est requis' },
        { schema: createCommentValidation, desc: 'create: content missing', data: {}, valid: false, expectedMessage: 'Le contenu du commentaire est obligatoire' },
        { schema: createCommentValidation, desc: 'create: content too short', data: { content: 'A' }, valid: false, expectedMessage: 'Le contenu du commentaire doit contenir au moins 2 caractères' },
        { schema: createCommentValidation, desc: 'create: valid content', data: { content: 'Un commentaire valide' }, valid: true },

        { schema: updateCommentValidation, desc: 'update: content too short', data: { content: 'A' }, valid: false, expectedMessage: 'Le contenu du commentaire doit contenir au moins 2 caractères' },
        { schema: updateCommentValidation, desc: 'update: valid content', data: { content: 'Mise à jour du commentaire' }, valid: true },
        { schema: updateCommentValidation, desc: 'update: content omitted', data: {}, valid: true },
    ];

    test.each(testCases)('$desc', ({ schema, data, valid, expectedMessage }) => {
        expectJoiValidation(schema, data, { valid, expectedMessage });
    });
});
