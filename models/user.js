const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')


const UserSchema = new mongoose.Schema({
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
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    }
}, {timestamps: true});

UserSchema.pre('save', async function(){
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

const User = mongoose.model('User', UserSchema)
module.exports = User