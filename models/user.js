const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name.'],
        minlength: 6,
        maxlength: 50
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Please provide an email.'],
        validate: {
            validator: validator.isEmail,
            message: 'Please provide a valid email'
        }
    },
    password: {
        type: String,
        required: [true, 'Please provide a password.'],
        minlength: 8

    }
})


const User = mongoose.model('User', userSchema)


module.exports = User