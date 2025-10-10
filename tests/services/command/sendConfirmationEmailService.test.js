const sendConfirmationEmailService = require('../../../services/command/user/sendConfirmationEmailService');
const transporter = require('../../../utils/email/transportEmail');

jest.mock('../../../utils/email/transportEmail', () => ({
    sendMail: jest.fn().mockResolvedValue({ messageId: 'test-id' }),
}));

describe('sendConfirmationEmailService', () => {
    const user = {
        newEmail: 'user@example.com',
        confirmationToken: 'abc123',
    };

    beforeAll(() => {
        process.env.FRONTEND_URL = 'https://lamalle.fr';
        process.env.SMTP_USER = 'no-reply@lamalle.fr';
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should correctly inject variables into the registration template', async () => {
        await sendConfirmationEmailService(user, 'signup');
        expect(transporter.sendMail).toHaveBeenCalled();
        const mailArgs = transporter.sendMail.mock.calls[0][0];
        const { html, to, subject, from } = mailArgs;
        expect(to).toBe('user@example.com');
        expect(subject).toContain('Confirmez votre adresse email');
        expect(from).toBe('no-reply@lamalle.fr');
        expect(html).toContain('Bienvenue sur La malle');
        expect(html).toContain('Confirmez votre adresse email');
        expect(html).toContain('https://lamalle.fr/confirmation/abc123');
        expect(html).toContain('Merci de vous être inscrit sur notre application');
    });

    it('should correctly inject variables into the update template', async () => {
        await sendConfirmationEmailService(user, 'update');
        const mailArgs = transporter.sendMail.mock.calls[0][0];
        const { html } = mailArgs;
        expect(html).toContain('https://lamalle.fr/confirmation-update-email/abc123');
        expect(html).toContain('Merci de mettre à jour votre adresse email sur notre application');
    });

    it("should handle an unknown confirmation type", async () => {
        await sendConfirmationEmailService(user, 'unknown');
        const mailArgs = transporter.sendMail.mock.calls[0][0];
        const { html } = mailArgs;
        expect(html).toMatch(/<a href=".*">\s*Confirmez votre adresse email\s*<\/a>/);
        expect(html).not.toContain('undefined');
    });

    it('should include the email layout structure', async () => {
        await sendConfirmationEmailService(user);
        const mailArgs = transporter.sendMail.mock.calls[0][0];
        const { html } = mailArgs;
        expect(html).toContain('<html>');
        expect(html).toContain('<body');
        expect(html).toContain('&copy; 2025 La malle. Tous droits réservés.');
        expect(html).toContain('style="background-color: #5941FF;');
    });
});
