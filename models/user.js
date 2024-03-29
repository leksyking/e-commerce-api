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
    },
    verificationToken: {
        type: String
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verified: {
        type: Date
    },
    passwordToken:{
        type: String
    },
    passwordTokenExpirationDate:{
        type: Date
    }   
}, {timestamps: true});

UserSchema.pre('save', async function(){
     // check whether password was modified
    if (!this.isModified('password')) return;
    //Generate a sat
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.comparePassword = async function(enteredPassword){
    const isMatch = await bcrypt.compare(enteredPassword, this.password)
    return isMatch
}

const User = mongoose.model('User', UserSchema)
module.exports = User