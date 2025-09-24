const compileTemplate = require("../../../utils/email/compileTemplate")
const transporter = require("../../../utils/email/transportEmail")

const sendConfirmationEmail = async (user, confirmationType) => {
  const data = {
    isUpdate: confirmationType === 'update',
    isSignup: confirmationType === 'signup',
    isForgotPassword: confirmationType === 'forgotPassword',
    confirmationLink: confirmationLink(user, confirmationType)
  };
   const template = compileTemplate("confirmationEmail");
    const html = template(data.toObject());
  // const html = loadTemplate('../../../views/confirmationEmail.hbs', data);

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: confirmationType !== 'forgotPassword' ? user.newEmail : user.email,
    subject: confirmationType !== 'forgotPassword'
      ? 'Confirmez votre adresse email'
      : 'Confirmez afin de réinitialiser votre mot de passe',
    html
  };

  return transporter.sendMail(mailOptions);
};

const confirmationLink = (user, confirmationType) => {
  if (confirmationType === 'update') return `${process.env.FRONTEND_URL}/confirmation-update-email/${user.confirmationToken}`;
  if (confirmationType === 'signup') return `${process.env.FRONTEND_URL}/confirmation/${user.confirmationToken}`;
  return `${process.env.FRONTEND_URL}/form-reset-password/${user.confirmationToken}`;
};

module.exports = sendConfirmationEmail