const mongoose = require('mongoose');
const Joi = require('joi');

const exerciseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50
    },
    description: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 200
    },
    category: {
        type: String,
        required: true,
        enum: ["Core", "Upper Body", "Lower Body", "Full Body", "Cardio"]
    },
    difficulty: {
        type: String,
        required: true,
        enum: ["Beginner", "Intermediate", "Advanced"]
    },
    equipment: {
        type: String,
        required: true,
        minlength: 2,
    },
    location: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50
    },
    image: {
        url: {
            type: String,
            maxlength: 2048,
            default: "https://static.vecteezy.com/system/resources/previews/003/108/337/original/fitness-gym-logo-with-strong-athlete-and-barbell-vector.jpg"
        },
        alt: {
            type: String,
            maxlength: 2048,
            default: "exercise image"
        }
    },
    createAt: {
        type: Date,
        default: Date.now
    }
});

const Exercise = mongoose.model("Exercise", exerciseSchema, 'exercises');

function validateExercise(exercise) {
    const schema = Joi.object({
        name: Joi.string().min(2).max(50).required(),
        description: Joi.string().min(2).max(200).required(),
        category: Joi.string().required().valid("Core", "Upper Body", "Lower Body", "Full Body", "Cardio"),
        difficulty: Joi.string().required().valid("Beginner", "Intermediate", "Advanced"),
        equipment: Joi.string().min(2).required(),
        location: Joi.string().min(2).max(50).required(),
        image: Joi.object({
            url: Joi.string().min(5).max(2048).required(),
            alt: Joi.string().min(2).max(2048).required()
        })
    });

    return schema.validate(exercise);
}

module.exports = { Exercise, validateExercise };