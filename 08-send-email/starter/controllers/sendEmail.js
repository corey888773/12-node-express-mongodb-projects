const nodemailer = require("nodemailer");
const sgMail = require("@sendgrid/mail");

const sendEmailEtheral = async (req, res) => {
  let testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: "carmella.bayer91@ethereal.email",
      pass: "QxrEY8mk76ece1q2Mp",
    },
  });

  let info = await transporter.sendMail({
    from: '"Coding Addict" <piotrgasiorek773@gmail.com>',
    to: "piotrgasiorek773@gmail.com",
    subject: "Hello",
    html: "<h2>sending email</h2>",
    text: "Hello",
  });

  res.status(200).send("sendEmail");
};

const sendEmail = async (req, res) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: "piotrdropii4@gmail.com", // Change to your recipient
    from: "piotrgasiorek773@gmail.com", // Change to your verified sender
    subject: "Sending with SendGrid is Fun",
    text: "and easy to do anywhere, even with Node.js",
    html: "<strong>and easy to do anywhere, even with Node.js</strong>",
  };
  const info = await sgMail.send(msg);
  res.json(info);
};

module.exports = sendEmail;
