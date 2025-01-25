const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  secure: true,
  auth: {
    user: process.env.SERVER_EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const sendVerificationEmail = async (email, verificationCode) => {
  const mailOptions = {
    from: process.env.SERVER_EMAIL,
    to: email,
    subject: 'Verify Your Email',
    html: `
     <h1>Email Verification</h1>
     <p>Your verification code is: <strong>${verificationCode}</strong></p>
     <p>This code will expire in 10 minutes.</p>
     <p>If you didn't request this, please ignore this email.</p>
   `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
    return false;
  }
};

const sendPasswordResetEmail = async (email, resetCode) => {
  const mailOptions = {
    from: process.env.SERVER_EMAIL,
    to: email,
    subject: 'Reset Your Password',
    html: `
     <h1>Password Reset</h1>
     <p>Your password reset code is: <strong>${resetCode}</strong></p>
     <p>This code will expire in 10 minutes.</p>
     <p>If you didn't request this, please ignore this email.</p>
   `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return false;
  }
};

module.exports = { sendVerificationEmail, sendPasswordResetEmail };
