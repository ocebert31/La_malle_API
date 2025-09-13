nodemailer = require('nodemailer');

const sendConfirmationEmail = async (user, confirmationType) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: confirmationType !== 'forgotPassword' ? user.newEmail : user.email,
    subject: confirmationType !== 'forgotPassword'
      ? 'Confirmez votre adresse email'
      : 'Confirmez afin de réinitialiser votre mot de passe',
    html: html(user, confirmationType)
  };

  return transporter.sendMail(mailOptions);
};

const html = (user, confirmationType) => {
  return `<html>
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; margin: 0;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <div style="background-color: #5941FF; color: #ffffff; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">Bienvenue sur La malle</h1>
        </div>
        <div style="padding: 30px;">
          <h2 style="color: #333333; font-size: 20px;">
          ${confirmationType !== 'forgotPassword'
             ? 'Confirmez votre adresse email'
            : 'Confirmez afin de réinitialiser votre mot de passe'}
            </h2>
          <p style="color: #666666; font-size: 16px; line-height: 1.5;">
              ${confirmationType === 'update'
                ? 'Merci de mettre à jour votre adresse email sur notre application. Pour finaliser cette opération, veuillez confirmer votre nouvelle adresse e-mail en cliquant sur le bouton ci-dessous :'
                : confirmationType === 'signup'
                ? 'Merci de vous être inscrit sur notre application. Pour finaliser votre inscription, veuillez confirmer votre adresse e-mail en cliquant sur le bouton ci-dessous :'
                : 'Pour réinitialiser votre mot de passe, cliquez sur le bouton ci-dessous :'}
          </p>
          <div style="text-align: center; margin: 40px 0;">
            <a href='${confirmationLink(user, confirmationType)}' style="background-color: #FF915D; color: #ffffff; text-decoration: none; padding: 15px 30px; border-radius: 5px; font-size: 18px; display: inline-block;">
              
               ${confirmationType !== 'forgotPassword' ? 'Confirmez votre adresse email' : 'Confirmez afin de réinitialiser votre mot de passe'}
            </a>
          </div>
          <p style="color: #666666; font-size: 14px; line-height: 1.5;">
            Si vous n'avez pas demandé ce changement, veuillez ignorer cet e-mail.
          </p>
        </div>
        <div style="background-color: #f4f4f4; color: #999999; padding: 20px; text-align: center; font-size: 12px;">
          &copy; 2025 La malle. Tous droits réservés.
        </div>
      </div>
    </body>
  </html>`
}

const confirmationLink = (user, confirmationType) => {
  return confirmationType === 'update'
  ? `${process.env.FRONTEND_URL}/confirmation-update-email/${user.confirmationToken}`
  : confirmationType === 'signup'
  ? `${process.env.FRONTEND_URL}/confirmation/${user.confirmationToken}`
  : `${process.env.FRONTEND_URL}/form-reset-password/${user.confirmationToken}`;
}


module.exports = { sendConfirmationEmail };

