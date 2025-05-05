const mongoose = require('mongoose');
const Joi = require('joi');

/* תת סכמה עבור כל תרגיל */
const exerciseSchema = new mongoose.Schema({
    exerciseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise', required: true }, // ID של התרגיל
    sets: { type: Number, min: 1, max: 100, required: true }, // מספר הסטים
    reps: { type: Number, min: 1, max: 1000, required: true }, // מספר החזרות
    weight: { type: Number, min: 0, max: 1000, required: true }, // משקל
});

/* תת סכמה עבור כל יום */
const dayPlanSchema = new mongoose.Schema({
    day: { type: String, required: true }, // יום (Sunday, Monday וכו')
    exercises: { type: [exerciseSchema], default: [] }, // מערך של תרגילים
});

const userSchema = new mongoose.Schema({
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
    traineeLevel: {
        type: String,
        required: true,
        enum: ["Beginner", "Advanced", "Pro"]
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
    myPlan: {
        type: [dayPlanSchema], // מערך ימים
        default: [
            { day: "Sunday", exercises: [] },
            { day: "Monday", exercises: [] },
            { day: "Tuesday", exercises: [] },
            { day: "Wednesday", exercises: [] },
            { day: "Thursday", exercises: [] },
            { day: "Friday", exercises: [] },
            { day: "Saturday", exercises: [] },
        ],
    },
    isBusiness: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    createAt: { type: Date, default: new Date() },
})

const User = mongoose.model('User', userSchema, 'users');


function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string().min(2).max(255).required(),
        email: Joi.string().min(6).max(255).required().email(),
        phone: Joi.string().min(9).max(10).required(),
        password: Joi.string().min(6).max(255).required(),
        traineeLevel: Joi.string().valid("Beginner", "Advanced", "Pro").required(),
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

function validateUpdateUser(user) {
    const schema = Joi.object({
        name: Joi.string().min(2).max(255).required(),
        phone: Joi.string().min(9).max(10).required(),
        traineeLevel: Joi.string().valid("Beginner", "Advanced", "Pro").required(),
        image: Joi.object({
            url: Joi.string().min(5).max(2048).allow(""),
            alt: Joi.string().min(5).max(2048).allow(""),
        })
    })
    return schema.validate(user);
}

module.exports = {
    User, validateUser, validateLogin, validateUpdateUser,
}

/* function validateLogInDetails(user) {
    const schema = Joi.object({
        email: Joi.string().min(6).max(255).required().email(),
        password: Joi.string().min(6).max(255).required(),
    })
    return schema.validate(user);
} */