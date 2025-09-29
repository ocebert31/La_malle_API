const nodemailer = require('nodemailer');

jest.mock('nodemailer');

test('transporter is created correctly', () => {
    const sendMailMock = jest.fn();
    nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock });
    const transporter = require('../../../utils/email/transportEmail');
    expect(nodemailer.createTransport).toHaveBeenCalledWith({
        service: 'gmail',
        auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
        }
    });
    expect(transporter).toHaveProperty('sendMail');
    expect(typeof transporter.sendMail).toBe('function');
});
