const nodemailer = require('nodemailer');

const sendConfirmationEmail = async (user) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: user.email,
    subject: 'Confirmez votre compte',
    text: 'pouet',
    html: `<html>
                <body>
                    <a href='http://localhost:3000/confirmation/${user.confirmationToken}'>ici</a> le lien pour valider votre email
                </body>
            </html>`
  };
  return transporter.sendMail(mailOptions)
};

module.exports = { sendConfirmationEmail };
