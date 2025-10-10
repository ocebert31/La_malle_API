const sendResetPasswordService = require('../../../services/command/user/sendResetPasswordService');
const transporter = require('../../../utils/email/transportEmail');

jest.mock('../../../utils/email/transportEmail', () => ({
    sendMail: jest.fn().mockResolvedValue({ messageId: 'test-id' }),
}));

describe('sendResetPasswordService', () => {
    const user = {
        email: 'user@example.com',
        confirmationToken: 'reset123',
    };

    beforeAll(() => {
        process.env.FRONTEND_URL = 'https://lamalle.fr';
        process.env.SMTP_USER = 'no-reply@lamalle.fr';
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should inject all expected variables into the reset password template', async () => {
        await sendResetPasswordService(user);
        expect(transporter.sendMail).toHaveBeenCalled();
        const mailArgs = transporter.sendMail.mock.calls[0][0];
        const { html, to, subject, from } = mailArgs;
        expect(to).toBe('user@example.com');
        expect(from).toBe('no-reply@lamalle.fr');
        expect(subject).toContain('Confirmez afin de réinitialiser votre mot de passe');
        expect(html).toContain('Bienvenue sur La malle');
        expect(html).toContain('Confirmez afin de réinitialiser votre mot de passe');
        expect(html).toContain('Pour réinitialiser votre mot de passe, cliquez sur le bouton ci-dessous');
        expect(html).toContain('https://lamalle.fr/form-reset-password/reset123');
        expect(html).not.toContain('undefined');
    });

    it('should handle missing token gracefully', async () => {
        const userWithoutToken = { email: 'user@example.com' };
        await sendResetPasswordService(userWithoutToken);
        expect(transporter.sendMail).toHaveBeenCalled();
        const mailArgs = transporter.sendMail.mock.calls[0][0];
        const { html } = mailArgs;
        expect(html).toContain('https://lamalle.fr/form-reset-password/undefined');
    });

    it('should include the email layout structure when rendering the template', async () => {
        await sendResetPasswordService(user);
        const mailArgs = transporter.sendMail.mock.calls[0][0];
        const { html } = mailArgs;
        expect(html).toContain('<html>');
        expect(html).toContain('<body');
        expect(html).toContain('style="background-color: #5941FF;'); 
        expect(html).toContain('&copy; 2025 La malle. Tous droits réservés.');
    });

    it('should fail on purpose to test CI', () => {
        expect(true).toBe(false);
    });
});
