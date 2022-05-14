const sendMail = require('./sendEmail')

const sendVerificationEmail = async ({name, email, verificationToken, origin}) => {
    const verifyEmail = `${origin}/auth/verify-email?token=${verificationToken}&email=${email}`;
    const message = `<p>Please confirm your email by clicking this link: <a href="${verifyEmail}">Verify Email</a></p>`;
    return sendMail({
        to:email,
        subject: 'Email Confirmation',
        html:`<h4>Hello, ${name}</h4>
        ${message}`
    });
};

module.exports = sendVerificationEmail;