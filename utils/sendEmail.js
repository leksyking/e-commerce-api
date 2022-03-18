const nodemailer = require('nodemailer')
const nodemailerConfig = require('./nodemailerConfig')

const sendMail = async ({to, subject, html}) => {
    let transporter = nodemailer.createTransport(nodemailerConfig);
    let mailOptions = {
            from: '"Leksyking" <gbemilekeogundipe@gmail.com>', // sender address
            to,// list of receivers
            subject, // Subject line
            html, // html body
    }
    return transporter.sendMail(mailOptions);
}

module.exports = sendMail;