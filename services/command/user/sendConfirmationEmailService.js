const compileTemplate = require("../../../utils/email/compileTemplate")
const transporter = require("../../../utils/email/transportEmail")

const sendConfirmationEmailService = async (user, confirmationType) => {
  const data = {
    isUpdate: confirmationType === 'update',
    isSignup: confirmationType === 'signup',
    confirmationLink: confirmationLink(user, confirmationType)
  };
  const template = compileTemplate("confirmationEmail", 'user');
  const html = template(data);

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: user.newEmail,
    subject: 'Confirmez votre adresse email',
    html
  };

  return transporter.sendMail(mailOptions);
};

const confirmationLink = (user, confirmationType) => {
  if (confirmationType === 'update') return `${process.env.FRONTEND_URL}/confirmation-update-email/${user.confirmationToken}`;
  if (confirmationType === 'signup') return `${process.env.FRONTEND_URL}/confirmation/${user.confirmationToken}`;
};

module.exports = sendConfirmationEmailService