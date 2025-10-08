const { createContactValidation, updateStatusValidation } = require('../../validations/contactValidation');
const { expectJoiValidation } = require('../../utils/testing/expectJoiValidation');

describe('Contact validation', () => {
    describe('createContactValidation failed', () => {
        const schema = createContactValidation;

        test.each([
            { desc: 'name missing', data: {}, valid: false, expectedMessage: 'Le nom est obligatoire' },
            { desc: 'name empty', data: { name: '' }, valid: false, expectedMessage: 'Le nom est requis' },
            { desc: 'name wrong type', data: { name: 123 }, valid: false, expectedMessage: 'Le nom doit être une chaîne de caractères' },
            { desc: 'name too short', data: { name: 'A' }, valid: false, expectedMessage: 'Le nom doit contenir au moins 2 caractères' },
        ])('$desc', ({ data, valid, expectedMessage }) => {
            expectJoiValidation(schema, data, { valid, expectedMessage });
        });

        test.each([
            { desc: 'firstName missing', data: { name: 'Durand' }, valid: false, expectedMessage: 'Le prénom est obligatoire' },
            { desc: 'firstName empty', data: { name: 'Durand', firstName: '' }, valid: false, expectedMessage: 'Le prénom est requis' },
            { desc: 'firstName wrong type', data: { name: 'Durand', firstName: 123 }, valid: false, expectedMessage: 'Le prénom doit être une chaîne de caractères' },
            { desc: 'firstName too short', data: { name: 'Durand', firstName: 'A' }, valid: false, expectedMessage: 'Le prénom doit contenir au moins 2 caractères' },
        ])('$desc', ({ data, valid, expectedMessage }) => {
            expectJoiValidation(schema, data, { valid, expectedMessage });
        });

        test.each([
            { desc: 'email missing', data: { name: 'Durand', firstName: 'Paul' }, valid: false, expectedMessage: "L'e-mail est obligatoire" },
            { desc: 'email empty', data: { name: 'Durand', firstName: 'Paul', email: '' }, valid: false, expectedMessage: "L'e-mail est requis" },
            { desc: 'email invalid format', data: { name: 'Durand', firstName: 'Paul', email: 'invalid' }, valid: false, expectedMessage: "L'adresse e-mail doit être valide" },
        ])('$desc', ({ data, valid, expectedMessage }) => {
            expectJoiValidation(schema, data, { valid, expectedMessage });
        });

        test.each([
            { desc: 'phone invalid characters', data: { name: 'Durand', firstName: 'Paul', email: 'test@mail.com', phone: 'abc' }, valid: false, expectedMessage: "Le numéro de téléphone n'est pas valide" },
        ])('$desc', ({ data, valid, expectedMessage }) => {
            expectJoiValidation(schema, data, { valid, expectedMessage });
        });

        test.each([
            { desc: 'description wrong type', data: { name: 'Durand', firstName: 'Paul', email: 'mail@mail.com', typeRequest: 'Demande', rgpd: true, description: 123 }, valid: false, expectedMessage: 'La description doit être une chaîne de caractères' },
        ])('$desc', ({ data, valid, expectedMessage }) => {
            expectJoiValidation(schema, data, { valid, expectedMessage });
        });

        test.each([
            { desc: 'typeRequest missing', data: { name: 'Durand', firstName: 'Paul', email: 'mail@mail.com', rgpd: true }, valid: false, expectedMessage: 'Le type de demande est obligatoire' },
            { desc: 'typeRequest empty', data: { name: 'Durand', firstName: 'Paul', email: 'mail@mail.com', rgpd: true, typeRequest: '' }, valid: false, expectedMessage: 'Le type de demande est requis' },
        ])('$desc', ({ data, valid, expectedMessage }) => {
            expectJoiValidation(schema, data, { valid, expectedMessage });
        });

        test.each([
            { desc: 'desiredDate past', data: { name: 'Durand', firstName: 'Paul', email: 'mail@mail.com', typeRequest: 'Demande', rgpd: true, desiredDate: '2000-01-01' }, valid: false, expectedMessage: 'La date souhaitée doit être dans le futur' },//???
            { desc: 'desiredDate invalid format', data: { name: 'Durand', firstName: 'Paul', email: 'mail@mail.com', typeRequest: 'Demande', rgpd: true, desiredDate: 'not-a-date' }, valid: false, expectedMessage: 'La date souhaitée doit être une date valide'},
        ])('$desc', ({ data, valid, expectedMessage }) => {
            expectJoiValidation(schema, data, { valid, expectedMessage });
        });

        test.each([
            { desc: 'urgence invalid value', data: { name: 'Durand', firstName: 'Paul', email: 'mail@mail.com', typeRequest: 'Demande', rgpd: true, urgence: 'Critique' }, valid: false, expectedMessage: "L'urgence doit être 'Faible', 'Moyenne' ou 'Élevée'" },
        ])('$desc', ({ data, valid, expectedMessage }) => {
            expectJoiValidation(schema, data, { valid, expectedMessage });
        });

        test.each([
            { desc: 'rgpd missing', data: { name: 'Durand', firstName: 'Paul', email: 'mail@mail.com', typeRequest: 'Demande' }, valid: false, expectedMessage: 'Le consentement RGPD est obligatoire' },
            { desc: 'rgpd false', data: { name: 'Durand', firstName: 'Paul', email: 'mail@mail.com', typeRequest: 'Demande', rgpd: false }, valid: false, expectedMessage: "Vous devez accepter le traitement des données" },
        ])('$desc', ({ data, valid, expectedMessage }) => {
            expectJoiValidation(schema, data, { valid, expectedMessage });
        });

        test('create: default urgence value is Moyenne', () => {
            const data = {
                name: 'Durand',
                firstName: 'Paul',
                email: 'test@mail.com',
                typeRequest: 'Demande',
                rgpd: true,
            };
            const { error, value } = schema.validate(data);
            expect(error).toBeUndefined();
            expect(value.urgence).toBe('Moyenne');
        });
    });

    describe("createContactValidation is valide", () => {
        test('createContactValidation valid data', () => {
            const data = {
                name: 'Durand',
                firstName: 'Paul',
                email: 'paul.durand@mail.com',
                phone: '+33612345678',
                description: 'Je souhaite obtenir des informations sur votre service.',
                typeRequest: 'Demande de renseignement',
                desiredDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                urgence: 'Élevée',
                rgpd: true,
            };
            const { error, value } = createContactValidation.validate(data);
            expect(error).toBeUndefined();
            expect(value).toEqual(expect.objectContaining({
                name: 'Durand',
                firstName: 'Paul',
                email: 'paul.durand@mail.com',
                phone: '+33612345678',
                description: 'Je souhaite obtenir des informations sur votre service.',
                typeRequest: 'Demande de renseignement',
                desiredDate: expect.any(Date), 
                urgence: 'Élevée',
                rgpd: true,
            }));
        });         
    })

    describe('updateStatusValidation', () => {
        const schema = updateStatusValidation;
        test.each([
            { desc: 'status missing', data: {}, valid: false, expectedMessage: 'Le statut est obligatoire' },
            { desc: 'status invalid', data: { status: 'Terminé' }, valid: false, expectedMessage: "Le statut doit être 'En attente', 'Acceptée', 'Rejetée' ou 'En cours'" },
            { desc: 'status valid', data: { status: 'En cours' }, valid: true },
        ])('$desc', ({ data, valid, expectedMessage }) => {
            expectJoiValidation(schema, data, { valid, expectedMessage });
        });
    });
});
