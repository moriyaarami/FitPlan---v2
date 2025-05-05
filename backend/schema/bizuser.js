const mongoose = require('mongoose');
const Joi = require('joi');

const bizUserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 255
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 6,
        maxlength: 255
    },
    phone: {
        type: String,
        required: true,
        minlength: 9,
        maxlength: 10
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 1024
    },
    image: {
        url: {
            type: String,
            maxlength: 2048,
            default: "https://th.bing.com/th/id/OIP.0uaGrLEY_HxDEyklFhqGXgAAAA?rs=1&pid=ImgDetMain"
        },
        alt: {
            type: String,
            maxlength: 2048,
            default: "profile image"
        }
    },
    myTrinees: [
        {
            traineeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainee' }
        }
    ],
    isBusiness: {
        type: Boolean,
        default: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    createAt: { type: Date, default: new Date() },
})
const BizUser = mongoose.model('BizUser', bizUserSchema, 'bizusers');

function validateBizUser(user) {
    const schema = Joi.object({
        name: Joi.string().min(2).max(255).required(),
        email: Joi.string().min(6).max(255).required().email(),
        phone: Joi.string().min(9).max(10).required(),
        password: Joi.string().min(6).max(255).required(),
        image: Joi.object({
            url: Joi.string().min(5).max(2048).allow(""),
            alt: Joi.string().min(5).max(2048).allow(""),
        }),
        isAdmin: Joi.boolean(),
    })
    return schema.validate(user);
}


function validateLogin(user) {
    const schema = Joi.object({
        email: Joi.string().min(6).max(255).required().email(),
        password: Joi.string().min(6).max(255).required(),
    })
    return schema.validate(user);
}

function validateUpdateBizUser(user) {
    const schema = Joi.object({
        name: Joi.string().min(2).max(255).required(),
        phone: Joi.string().min(9).max(10).required(),
        image: Joi.object({
            url: Joi.string().min(5).max(2048).allow(""),
            alt: Joi.string().min(5).max(2048).allow(""),
        })
    })
    return schema.validate(user);
}

module.exports = { BizUser, validateBizUser, validateLogin, validateUpdateBizUser }