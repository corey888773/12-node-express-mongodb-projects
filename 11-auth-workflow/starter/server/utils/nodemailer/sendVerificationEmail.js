const sendEmail = require("./sendEmail");

const sendVerificationEmail = async ({ name, email, verificationToken, origin }) => {
  const subject = "Email Verification";
  const html = `
    <h1>Hi ${name},</h1>
    <p>Please verify your email by clicking the link below:</p>
    <a href="${origin}/user/verify-email?email=${email}&token=${verificationToken}">Verify Email</a>`;
  return sendEmail({ to: email, subject, html });
};

module.exports = sendVerificationEmail;
