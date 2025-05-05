const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { User, validateUser, validateLogin, validateUpdateUser } = require('../schema/users');
const { BizUser } = require('../schema/bizuser');
const { Exercise } = require('../schema/exercise')
const authMW = require('../middleware/auth');
const getMyPlanMW = require('../middleware/getPlan')

const router = express.Router();


router.post('/signup', async (req, res) => {
    try {
        const { error } = validateUser(req.body);
        if (error) {
            res.status(400).send(error.details[0].message);
            return;
        }

        let bizuser = await BizUser.findOne({ email: req.body.email });
        let user = await User.findOne({ email: req.body.email });

        if (user || bizuser) {
            res.status(400).send('User already exists.');
            return;
        }

        user = await new User(req.body);
        user.password = await bcrypt.hash(user.password, 12);
        await user.save();
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error:' + err.message);
        return;
    }
});

router.post('/login', async (req, res) => {
    try {
        const { error } = validateLogin(req.body);
        if (error) {
            res.status(400).send(error.details[0].message);
            return;
        }

        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            res.status(400).send('Invalid email or password.');
            return;
        }

        const validatePassword = await bcrypt.compare(req.body.password, user.password);

        if (!validatePassword) {
            res.status(400).send('Invalid email or password.');
            return;
        }

        const token = jwt.sign({ _id: user._id, admin: user.isAdmin, biz: user.isBusiness }, config.jwtKey);

        res.json({ token });
        return;
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error:' + err.message);
        return;
    }
});

router.get('/', authMW, async (req, res) => {
    try {
        if (!req.user.admin) {
            res.status(400).send('just admin user can get the all users');
            return;
        }

        const users = await User.find();
        if (users.length == 0) {
            res.status(404).send('have not users on the database');
            return;
        }
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error:' + err.message);
        return;
    }
})

router.get('/:id', authMW, async (req, res) => {
    try {
        const registeredUser = req.params.id === req.user._id ? true : false;
        const admin = req.user.admin;

        if (registeredUser || admin) {
            const user = await User.findById(req.params.id);
            if (!user) {
                res.status(404).send('User not found.');
                return;
            }
            res.json(user);
            return;
        }

        res.status(401).send(`You do not have permission to access the user's details.`);
        return;

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error:' + err.message);
        return;
    }
})

router.put('/:id', authMW, async (req, res) => {
    try {
        const { error } = validateUpdateUser(req.body);
        if (error) {
            res.status(400).send(error.details[0].message);
            return;
        }
        const registeredUser = req.params.id === req.user._id ? true : false;
        const admin = req.user.admin;

        if (registeredUser || admin) {
            const user = await User.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true });

            if (!user) {
                res.status(400).send('Not Found user with this id');
                return;
            }

            res.json(user);
            return;
        }

        res.status(401).send(`You do not have permission to access the user's details.`);
        return;

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error:' + err.message);
        return;
    }
})

router.delete('/:id', authMW, async (req, res) => {
    try {
        const adminUser = req.user.admin;
        const registeredUser = req.params.id === req.user._id ? true : false;

        if (adminUser || registeredUser) {
            const user = await User.findByIdAndDelete(req.params.id);
            if (!user) {
                res.status(404).send('No user found with this id.');
                return;
            }
            res.send(`the user:${user.name} deleted successfully.`);
            return;
        }
        res.status(400).send("just admin user or registered user can delete the user");
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error:' + err.message);
        return;
    }

})

router.patch('/addToMyPlan/:id', authMW, getMyPlanMW, async (req, res) => {
    try {
        const { dayName, exerciseId, sets, reps, weight } = req.body;
        const myPlan = req.myPlan;
        const day = myPlan.find(d => d.day === dayName);
        if (!day) {
            res.status(400).send('Day not found in your plan');
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
            res.status(400).send('Exercise already in your plan');
            return;
        }

        await day.exercises.push({ exerciseId, sets, reps, weight });

        const updatedUser = await User.findByIdAndUpdate(req.user._id, { myPlan }, { new: true });
        res.json(updatedUser.myPlan);
        return;
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error:' + err.message);
        return;
    }
})

router.patch('/removeFromMyPlan/:id', authMW, getMyPlanMW, async (req, res) => {
    try {

        const { dayName, exerciseId } = req.body;
        const myPlan = req.myPlan;
        const day = myPlan.find(d => d.day === dayName);
        if (!day) {
            res.status(400).send('Day not found in your plan');
            return;
        }
        console.log(day.exercises.exerciseId);
        const updatedUser = await User.findOneAndUpdate({ _id: req.user._id, "myPlan.day": dayName }, {
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