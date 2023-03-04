const nodemailer = require("nodemailer");
const nodemailerConfig = require("./nodemalerConfig");

const sendEmail = async ({ to, subject, html }) => {
  let testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport(nodemailerConfig);

  return transporter.sendMail({
    from: '"PiotrusKozak" <PiotrusKozak@example.com>', // sender address
    to,
    subject,
    html,
  });
};

module.exports = sendEmail;
