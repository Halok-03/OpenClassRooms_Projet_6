const mongoose = require ('mongoose')
const MongooseErrors = require('mongoose-errors')
const uniqueValidator = require('mongoose-unique-validator') // Permet d'etre sur d'avoir une seule adresse mail unique dans la db

const userSchema = mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        }
    }
)

userSchema.plugin(uniqueValidator, MongooseErrors) // On applique uniquevalidator au schema avant de le mettre en model //

module.exports = mongoose.model('users', userSchema)