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
    html: `
      <html>
        <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; margin: 0;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
            <div style="background-color: #6d4cb4; color: #ffffff; padding: 20px; text-align: center;">
              <h1 style="margin: 0; font-size: 24px;">Bienvenue sur Inkstream</h1>
            </div>
            <div style="padding: 30px;">
              <h2 style="color: #333333; font-size: 20px;">Confirmez votre adresse email</h2>
              <p style="color: #666666; font-size: 16px; line-height: 1.5;">
                Merci de vous être inscrit sur notre application. Pour finaliser votre inscription, veuillez confirmer votre adresse email en cliquant sur le bouton ci-dessous :
              </p>
              <div style="text-align: center; margin: 40px 0;">
                <a href='http://localhost:3000/confirmation/${user.confirmationToken}' style="background-color: #ff8f5f; color: #ffffff; text-decoration: none; padding: 15px 30px; border-radius: 5px; font-size: 18px; display: inline-block;">
                  Confirmer mon email
                </a>
              </div>
              <p style="color: #666666; font-size: 14px; line-height: 1.5;">
                Si vous n'avez pas créé de compte chez nous, veuillez ignorer cet email.
              </p>
            </div>
            <div style="background-color: #f4f4f4; color: #999999; padding: 20px; text-align: center; font-size: 12px;">
              &copy; 2024 Inkstream. Tous droits réservés.
            </div>
          </div>
        </body>
      </html>`
  };
  return transporter.sendMail(mailOptions)
};

module.exports = { sendConfirmationEmail };
