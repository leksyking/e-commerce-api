module.exports = {
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USERNAME, // generated ethereal user
      pass: process.env.SMTP_PASSWORD, // generated ethereal password
    }
}