const compileTemplate = require("../../../utils/email/compileTemplate")
const transporter = require("../../../utils/email/transportEmail")

const sendResetPasswordService = async (user) => {
  const template = compileTemplate("confirmationPassword", 'user');
  const html = template({
    confirmationLink: buildConfirmationLink(user)
  });

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: user.email,
    subject: 'Confirmez afin de réinitialiser votre mot de passe',
    html
  };

  return transporter.sendMail(mailOptions);
};

const buildConfirmationLink = (user) => {
  return `${process.env.FRONTEND_URL}/form-reset-password/${user.confirmationToken}`;
};

module.exports = sendResetPasswordService