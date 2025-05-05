const { BizUser } = require('../schema/bizuser');
const { Trainee } = require('../schema/trainee')

module.exports = getMyTraineePlanMw = async (req, res, next) => {
    try {
        const bizuser = await BizUser.findById(req.user._id);
        if (!bizuser) {
            res.status(400).send('not found business user');
            return;
        }

        const myTrainees = bizuser.myTrinees;

        if (myTrainees.length == 0) {
            res.status(400).send('not found any trainees');
            return;
        }

        let trainee = myTrainees.find(trainee => trainee.traineeId.toString() === req.params.TraineeId);

        if (!trainee) {
            res.status(400).send('not found trainee for this business user');
            return;
        }

        trainee = await Trainee.findById(trainee.traineeId);

        req.traineePlan = trainee.myPlan
        next();

    } catch (err) {
        res.status(500).send(err.message);
    }

};