const PORT = 3000;
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
require('dotenv').config();
const bcrypt = require('bcrypt');
const cors = require('cors');
const { User } = require('./schema/users');
const { users } = require('./data/users.json')

const { exercises } = require('./data/exercise.json')
const { Exercise } = require('./schema/exercise')

const userRouter = require('./routers/users');
const bizUserRouter = require('./routers/bizUsers');
const bizTraineesRouter = require('./routers/trainees');
const exerciseRouter = require('./routers/exercise');

const app = express();
app.use(cors())
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/user', userRouter);
app.use('/api/bizuser/trainee', bizTraineesRouter)
app.use('/api/bizuser', bizUserRouter);
app.use('/api/exercise', exerciseRouter);

const uri = process.env.ENVIRONMENT === "production" ? process.env.CONNECTION_STRING_ATLAS : process.env.LOCAL_CONNECTION_STRING;

console.log(process.env.ENVIRONMENT)


async function connect() {
    await mongoose.connect(uri)
        .then(() => uri == process.env.LOCAL_CONNECTION_STRING ? console.log("Connected to MongoDB") : console.log("You connect to Atlas Server"))
        .catch(err => console.log("Error :" + err.message))

    app.listen(PORT, () => {
        if (uri == process.env.LOCAL_CONNECTION_STRING) {
            createUsers();
            createExercize();
        }

        console.log(`Server is running on port ${PORT}`);
    })
}

connect();

async function createUsers() {
    const usersFromDb = await User.find();
    users.forEach(async user => {
        if (usersFromDb.find((dbUser) => dbUser.email === user.email)) {
            return;
        }
        const newUser = new User(user);
        newUser.password = await bcrypt.hash(newUser.password, 12);
        newUser.save();
    });
}
async function createExercize() {
    const exercisesFromDb = await Exercise.find();
    if (exercisesFromDb.length > 0) {
        return;
    }
    exercises.forEach(async ex => {
        const newEx = new Exercise(ex);
        newEx.save();
    });
}



