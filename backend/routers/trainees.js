const express = require('express');
const { Trainee, validateTrainee, validateUpdateTrainee } = require('../schema/trainee');
const { BizUser } = require('../schema/bizuser');
const { Exercise } = require('../schema/exercise')

const authMW = require('../middleware/auth');
const getMyTraineePlanMw = require('../middleware/getTraineePlan')

const router = express.Router();

router.post('/add', authMW, async (req, res) => {
    try {
        const { error } = validateTrainee(req.body);
        if (error) {
            res.status(400).send(error.details[0].message);
            return;
        }
        let bizUser = await BizUser.findById(req.user._id);
        if (!bizUser) {
            res.status(400).send('just bisness user can perform this action.');
            return;
        }

        let trainee = await Trainee.findOne({ phone: req.body.phone });
        if (trainee) {
            res.status(400).send('Trainee already exists.');
            return;
        }

        trainee = await new Trainee({ ...req.body, user_id: req.user._id });
        await trainee.save();

        await bizUser.myTrinees.push({ traineeId: trainee.id });
        await bizUser.save();

        res.send(trainee);
        return;
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error:' + err.message);
        return;
    }

});

router.get('/myTrainees', authMW, async (req, res) => {
    try {
        const bizUser = await BizUser.findById(req.user._id).populate('myTrinees.traineeId');

        if (!bizUser) {
            res.status(400).send('not found business user');
            return;
        }

        res.send(bizUser.myTrinees);
        return;
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error:' + err.message);
        return;
    }
});

router.get('/:id', authMW, async (req, res) => {
    try {

        const bizUser = await BizUser.findById(req.user._id);
        if (!bizUser) {
            res.status(400).send('not found business user');
            return;
        }

        /* מציאת כל המתאמנים של המשתמש העסקי */
        const Trainees = await Trainee.find({ user_id: req.user._id });

        if (Trainees.length == 0) {
            res.status(400).send('not found trainee');
            return;
        }

        /* להשיג את המתאמן הספציפי */
        const trainee = Trainees.filter(trainee => trainee._id == req.params.id);
        if (trainee.length == 0) {
            res.status(400).send('not found trainee with this id');
            return;
        }
        res.send(trainee);
        return;
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error:' + err.message);
        return;
    }
})

router.put('/:id', authMW, async (req, res) => {
    try {
        const { error } = validateUpdateTrainee(req.body);
        if (error) {
            res.status(400).send(error.details[0].message);
            return;
        }

        let bizuser = await BizUser.findById(req.user._id);
        if (!bizuser) {
            res.status(400).send('not found business user');
            return;
        }

        const Trainees = await Trainee.find({ user_id: req.user._id });

        if (Trainees.length == 0) {
            res.status(400).send('not found trainees for user');
            return;
        }

        let trainee = await Trainee.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!trainee) {
            res.status(400).send('not found trainee with this id');
            return;
        }

        res.send(trainee);
        return;

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error:' + err.message);
        return;
    }

})

router.delete('/:id', authMW, async (req, res) => {
    try {
        let bizUser = await BizUser.findById(req.user._id);

        if (!bizUser) {
            res.status(400).send('not found business user..');
            return;
        }
        const Trainees = await Trainee.find({ user_id: req.user._id });

        if (Trainees.length == 0) {
            res.status(400).send('not have trainees for this user');
            return;
        }

        const trainee = await Trainee.findByIdAndDelete(req.params.id);

        if (!trainee) {
            res.status(400).send('not found trainee with this id');
            return;
        }



        bizUser = await BizUser.findByIdAndUpdate(req.user._id, { $pull: { myTrinees: { traineeId: req.params.id } } })

        res.send(`the trainee: ${trainee.name} deleted successfully.`);
        return;
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error:' + err.message);
        return;
    }
});

router.patch('/addToTraineePlan/:TraineeId', authMW, getMyTraineePlanMw, async (req, res) => {
    try {

        const { dayName, exerciseId, sets, reps, weight } = req.body;
        const myPlan = req.traineePlan;
        const day = myPlan.find(d => d.day === dayName);
        if (!day) {
            res.status(400).send('Day not found in the plan');
            return;
        }

        const exercise = await Exercise.findById(exerciseId);
        if (!exercise) {
            res.status(400).send('Exercise not found');
            return;
        }

        const hasEX = day.exercises.some(ex => {
            return ex.exerciseId.toString() === exercise._id.toString();
        })

        if (hasEX) {
            res.status(400).send('Exercise already exists in the plan');
            return;
        }

        await day.exercises.push({ exerciseId, sets, reps, weight });

        const updatedTrainee = await Trainee.findByIdAndUpdate(req.params.TraineeId, { myPlan }, { new: true });
        res.json(updatedTrainee.myPlan);
        return;
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error:' + err.message);
        return;
    }
});

router.patch('/removeFromTraineePlan/:TraineeId', authMW, getMyTraineePlanMw, async (req, res) => {
    try {
        const { dayName, exerciseId } = req.body;
        const myPlan = req.traineePlan;

        const day = myPlan.find(d => d.day === dayName);
        if (!day) {
            res.status(400).send('Day not found in your plan');
            return;
        }



        const updatedUser = await Trainee.findOneAndUpdate({ _id: req.params.TraineeId, "myPlan.day": dayName }, {
            $pull: {
                "myPlan.$.exercises": { exerciseId: exerciseId },
            }
        }, { new: true });

        res.json(updatedUser.myPlan);
        return;
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error:' + err.message);
        return;
    }
});

module.exports = router;