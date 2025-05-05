const express = require('express');
const { Exercise, validateExercise } = require('../schema/exercise')
const authMW = require('../middleware/auth')
const router = express.Router();

router.post('/create', authMW, async (req, res) => {
    try {
        const { error } = validateExercise(req.body);
        if (error) {
            res.status(400).send(error.details[0].message);
            return;
        }

        if (!req.user.admin) {
            res.status(401).send('just admin user can create exercise');
            return;
        }

        const exercise = await new Exercise(req.body);
        await exercise.save();

        res.send(exercise);
        return;
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error:' + err.message);
        return;
    }
})

router.put('/update/:id', authMW, async (req, res) => {
    try {
        const { error } = validateExercise(req.body);
        if (error) {
            res.status(400).send(error.details[0].message);
            return;
        }

        if (!req.user.admin) {
            res.status(401).send('just admin user can update exercise');
            return;
        }

        const exercise = await Exercise.findByIdAndUpdate(req.params.id, req.body, { returnDocument: true });
        if (!exercise) {
            res.status(404).send('exercise not found');
            return;
        }

        res.send(exercise);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error:' + err.message);
        return;
    }
});

router.delete('/delete/:id', authMW, async (req, res) => {
    try {
        if (!req.user.admin) {
            res.status(401).send('just admin user can delete exercise');
            return;
        }
        const exercise = await Exercise.findByIdAndDelete(req.params.id);
        if (!exercise) {
            res.status(404).send('exercise not found');
            return;
        }
        res.send(`the exercise:${exercise.name} deleted successfully.`);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error:' + err.message);
        return;
    }
})

router.get('/', async (req, res) => {
    try {
        const exercises = await Exercise.find();
        if (exercises.length == 0) {
            res.status(404).send('have not exercises on the database');
            return;
        }

        res.json(exercises);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error:' + err.message);
    }
})

router.get('/name', async (req, res) => {
    try {
        const exercise = await Exercise.findOne({ name: req.query.exercise });
        if (!exercise) {
            res.status(404).send('exercise not found');
            return;
        }

        res.json(exercise);
        return;
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error:' + err.message);
        return;
    }
})
router.get('/category', async (req, res) => {
    try {
        const exercises = await Exercise.find({ category: req.query.category });
        if (!exercises) {
            res.status(404).send('exercise not found');
            return;
        }

        res.json(exercises);
        return;
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error:' + err.message);
        return;
    }
})
router.get('/difficulty', async (req, res) => {
    try {
        const exercises = await Exercise.find({ difficulty: req.query.difficulty });
        if (!exercises) {
            res.status(404).send('exercise not found');
            return;
        }

        res.json(exercises);
        return;
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error:' + err.message);
        return;
    }
})



module.exports = router;