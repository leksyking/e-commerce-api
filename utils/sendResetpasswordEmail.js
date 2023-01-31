const sendMail = require('./sendEmail')

const sendRestPasswordEmail = async ({name, email, token, origin}) => {
    const resetURL = `${origin}/api/v1/reset-password?email=${email}&token=${token}`
    const message = `<p>Reset your password by clickig on this link: <a href="${resetURL}">Reset Password</a></p>`
    return sendMail({
        to:email,
        subject: "Reset Password",
        html: `<h4>Hello, ${name}</h4>
        ${message}
        `
    })
}

module.exports = sendRestPasswordEmail;