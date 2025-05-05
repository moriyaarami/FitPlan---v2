const express = require('express');

const { User } = require('../schema/users');
const { Trainee } = require('../schema/trainee');

const { BizUser, validateBizUser, validateLogin, validateUpdateBizUser } = require('../schema/bizuser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const authMW = require('../middleware/auth');

const router = express.Router();

router.post('/signup', async (req, res) => {
    try {
        const { error } = validateBizUser(req.body);
        if (error) {
            res.status(400).send(error.details[0].message);
            return;
        }

        let bizuser = await BizUser.findOne({ email: req.body.email });
        let user = await User.findOne({ email: req.body.email });

        if (bizuser || user) {
            res.status(400).send('User already exists.');
            return;
        }

        bizuser = await new BizUser(req.body);
        bizuser.password = await bcrypt.hash(bizuser.password, 12);
        await bizuser.save();
        res.json(bizuser);
        return;
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error:' + err.message);
        return;
    }
})

router.post('/login', async (req, res) => {
    try {
        const { error } = validateLogin(req.body);
        if (error) {
            res.status(400).send(error.details[0].message);
            return;
        }

        const bizuser = await BizUser.findOne({ email: req.body.email });

        if (!bizuser) {
            res.status(400).send('Invalid email or password.');
            return;
        }

        const validatePassword = await bcrypt.compare(req.body.password, bizuser.password);

        if (!validatePassword) {
            res.status(400).send('Invalid email or password.');
            return;
        }

        const token = jwt.sign({ _id: bizuser._id, admin: bizuser.isAdmin, biz: bizuser.isBusiness }, config.jwtKey);
        res.json({ token });
        return;
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error:' + err.message);
        return;
    }
})

router.get('/', authMW, async (req, res) => {
    try {
        if (!req.user.admin) {
            res.status(400).send('You do not have permission to perform this action,you must to be admin user.');
            return;
        }

        const users = await BizUser.find();
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
            const user = await BizUser.findById(req.params.id);
            if (!user) {
                res.status(404).send('User not found.');
                return;
            }
            res.json(user);
            return;
        }

        res.status(401).send(`You do not have permission to perform this action`);
        return;
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error:' + err.message);
        return;
    }
})

router.put('/:id', authMW, async (req, res) => {
    try {
        const { error } = validateUpdateBizUser(req.body);
        if (error) {
            res.status(400).send(error.details[0].message);
            return;
        }

        const registeredUser = req.params.id === req.user._id ? true : false;
        const admin = req.user.admin;


        if (registeredUser || admin) {
            const user = await BizUser.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true });

            if (!user) {
                res.status(400).send('Not Found user with this id.');
                return;
            }
            res.send(user);
            return;
        }

        res.status(401).send(`You do not have permission to perform this action.`);
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
            const user = await BizUser.findByIdAndDelete(req.params.id);
            if (!user) {
                res.status(404).send('No user found with this id.');
            }
            res.send(`the user:${user.name} deleted successfully.`);
            return;
        }
        res.status(400).send("just admin user or registered user can delete the user");
        return;
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error:' + err.message);
        return;
    }
})

router.get('/:id/getmyTrainee/:trainee_id', authMW, async (req, res) => {
    try {
        const registeredUser = req.params.id === req.user._id ? true : false; if (registeredUser) {
            const user = await BizUser.findById(req.params.id);
            if (!user) {
                res.status(404).send('User not found.');
                return;
            }

            const trainee = await Trainee.findById(req.params.trainee_id);
            if (!trainee) return res.status(404).send('Trainee not found.');
            console.log(trainee.user_id);
            console.log(user._id);
            if (!(trainee.user_id.toString() === user._id.toString())) {
                res.status(404).send('trainee not found');
                return;
            }

            res.send(trainee);
            return;
        };

        res.status(401).send(`You do not have permission to perform this action.`);
        return;
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error:' + err.message);
        return;
    }
})



module.exports = router;
