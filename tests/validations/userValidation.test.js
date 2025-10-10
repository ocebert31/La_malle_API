const { registrationValidation, sessionValidation, updateEmailValidation, updatePasswordValidation, forgotPasswordValidation, resetPasswordValidation } = require('../../validations/userValidation');
const { expectJoiValidation } = require('../../utils/testing/expectJoiValidation');
const { mapInvalidField } = require("../../utils/testing/mapInvalidField")

const validEmail = 'user@example.com';
const validPassword = 'abcdef';
const validNewPassword = 'newpass123';

const invalidEmail = [
  { desc: 'missing email', data: { password: validPassword, confirmPassword: validPassword }, expectedMessage: "L'email est obligatoire" },
  { desc: 'email empty', data: { email: '', password: validPassword, confirmPassword: validPassword }, expectedMessage: "L'email est requis" },
  { desc: 'invalid email format', data: { email: 'invalid', password: validPassword, confirmPassword: validPassword }, expectedMessage: "L'email n'est pas valide" },
]

const invalidPassword = [
  { desc: 'missing password', data: { email: validEmail, confirmPassword: validPassword }, expectedMessage: 'Le mot de passe est obligatoire' },
  { desc: 'password empty', data: { email: validEmail, password:"", confirmPassword: validPassword }, expectedMessage: 'Le mot de passe est requis' },
  { desc: 'password too short', data: { email: validEmail, password: 'abc', confirmPassword: 'abc' }, expectedMessage: 'Le mot de passe doit contenir au moins 6 caractères' },
]

const invalidConfirmPassword = [
  { desc: 'passwords mismatch', data: { email: validEmail, password: validPassword, confirmPassword: 'wrong' }, expectedMessage: 'Les mots de passe ne correspondent pas' },
  { desc: 'confirmPassword empty', data: { email: validEmail, password: validPassword, confirmPassword: "" }, expectedMessage: 'La confirmation du mot de passe est obligatoire' },
  { desc: 'missing confirmPassword', data: { email: validEmail, password: validPassword }, expectedMessage: 'La confirmation du mot de passe est obligatoire' },
]

const invalidUpdatePasswordValidation = [
  { desc: 'missing currentPassword', data: { newPassword: validNewPassword, confirmNewPassword: validNewPassword}, expectedMessage: 'Le mot de passe est obligatoire' },
  { desc: 'currentPassword empty', data: { currentPassword: "", newPassword: validNewPassword , confirmNewPassword: validNewPassword }, expectedMessage: 'Le mot de passe est requis' },
  { desc: 'currentPassword too short', data: { currentPassword: "abc", newPassword: validNewPassword, confirmNewPassword: validNewPassword }, expectedMessage: 'Le mot de passe doit contenir au moins 6 caractères' },

  { desc: 'missing newPassword', data: { currentPassword: validPassword, confirmNewPassword: validNewPassword}, expectedMessage: 'Le mot de passe est obligatoire' },
  { desc: 'newPassword empty', data: { currentPassword: validPassword, newPassword: "", confirmNewPassword: validNewPassword }, expectedMessage: 'Le mot de passe est requis' },
  { desc: 'newPassword too short', data: { currentPassword: validPassword, newPassword: "abc", confirmNewPassword: validNewPassword }, expectedMessage: 'Le mot de passe doit contenir au moins 6 caractères' },

  { desc: 'passwords mismatch', data: { currentPassword: validPassword, newPassword: validNewPassword, confirmNewPassword: 'wrong' }, expectedMessage: 'Les mots de passe ne correspondent pas' },
  { desc: 'confirmPassword empty', data: { currentPassword: validPassword, newPassword: validNewPassword, confirmNewPassword: "" }, expectedMessage: 'La confirmation du mot de passe est obligatoire' },
  { desc: 'missing confirmPassword', data: { currentPassword: validPassword, newPassword: validNewPassword }, expectedMessage: 'La confirmation du mot de passe est obligatoire' },
]

const testSuites = [
  {
    name: 'registrationValidation',
    schema: registrationValidation,
    valid: { email: validEmail, password: validPassword, confirmPassword: validPassword },
    invalid: [...invalidEmail, ...invalidPassword, ...invalidConfirmPassword],
  },
  {
    name: 'sessionValidation',
    schema: sessionValidation,
    valid: { email: validEmail, password: validPassword },
    invalid: [...invalidEmail, ...invalidPassword],
  },
  {
    name: 'updateEmailValidation',
    schema: updateEmailValidation,
    valid: { newEmail: validEmail, currentPassword: validPassword },
    invalid: mapInvalidField([...invalidEmail, ...invalidPassword], { email: 'newEmail', password: 'currentPassword' })
  },
  {
    name: 'updatePasswordValidation',
    schema: updatePasswordValidation,
    valid: { currentPassword: validPassword, newPassword: validNewPassword, confirmNewPassword: validNewPassword },
    invalid: invalidUpdatePasswordValidation,
  },
  {
    name: 'forgotPasswordValidation',
    schema: forgotPasswordValidation,
    valid: { email: validEmail },
    invalid: [...invalidEmail],
  },
  {
    name: 'resetPasswordValidation',
    schema: resetPasswordValidation,
    valid: { newPassword: validPassword, confirmNewPassword: validPassword },
    invalid: mapInvalidField([...invalidPassword, ...invalidConfirmPassword], { password: 'newPassword', confirmPassword: 'confirmNewPassword' })
  },
];

describe('🧩 User validations', () => {
  testSuites.forEach(({ name, schema, valid, invalid }) => {
    describe(name, () => {
      test('✅ valid data', () => {
        expectJoiValidation(schema, valid, { valid: true });
      });

      test.each(invalid)('❌ $desc', ({ data, expectedMessage }) => {
        expectJoiValidation(schema, data, { valid: false, expectedMessage });
      });
    });
  });
});
