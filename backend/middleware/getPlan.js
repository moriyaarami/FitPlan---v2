const { Model } = require('mongoose');
const { User } = require('../schema/users')

module.exports = getMyPlanMW = async (req, res, next) => {
    const registeredUser = req.params.id === req.user._id ? true : false;
    if (!registeredUser) {
        res.status(401).send('You are not registered user');
        return;
    }

    const user = await User.findById(req.user._id);
    if (!user) {
        res.status(404).send('User not found.');
        return;
    }

    req.myPlan = user.myPlan
    next();
};




