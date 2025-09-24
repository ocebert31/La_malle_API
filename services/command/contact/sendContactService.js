const loadTemplate = require("../../../utils/email/compileTemplate")
const transporter = require("../../../utils/email/transportEmail")
const path = require("path");

const sendContactService = async (newDemande) => {
  const template = loadTemplate("contactEmail");
  const html = template(newDemande.toObject());

  const mailOptions = {
      from: process.env.SMTP_USER,
      to: 'oceanebertrand339@gmail.com',
      replyTo: newDemande.email,
      subject: 'Nouvelle demande d\'animateur',
      html
  };

  return transporter.sendMail(mailOptions);
};

module.exports = sendContactService