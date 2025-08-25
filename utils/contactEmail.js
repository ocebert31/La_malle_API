nodemailer = require('nodemailer');

const contactEmail = async (newDemande) => {
  const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
      }
  });

  const mailOptions = {
    from: process.env.SMTP_USER,  
    to: "oceanebertrand339@gmail.com",
    replyTo: newDemande.email, 
    subject: "Nouvelle demande d'animateur",
    html: html(newDemande)
  };
  return transporter.sendMail(mailOptions);
};

const html = (newDemande) => {
  return `
  <html>
    <body style="font-family: Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 0;">
      <div style="max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);"> 
        <div style="background-color: #5941FF; color: #ffffff; padding: 20px; text-align: center;">
          <h2 style="margin: 0;">Nouvelle demande d'animateur</h2>
        </div>
        <div style="padding: 20px;">
          <p><strong>Nom :</strong> ${newDemande.name}</p>
          <p><strong>Prénom :</strong> ${newDemande.firstName}</p>
          <p><strong>Email :</strong> ${newDemande.email}</p>
          <p><strong>Téléphone :</strong> ${newDemande.phone}</p>
          <p><strong>Type de demande :</strong> ${newDemande.typeRequest}</p>
          <p><strong>Description :</strong><br/>${newDemande.description}</p>
          <p><strong>Date souhaitée :</strong> ${newDemande.desiredDate}</p>
          <p><strong>Urgence :</strong> ${newDemande.urgence}</p>
        </div>
        <div style="background-color: #f0f0f0; text-align: center; padding: 10px; font-size: 12px; color: #555;">
          La malle - Système de demandes d’animateur
        </div>
      </div>
    </body>
  </html>
  `;
};

module.exports = { contactEmail };