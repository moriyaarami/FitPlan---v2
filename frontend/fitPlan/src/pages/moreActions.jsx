import { useLocation } from "react-router-dom";
import ExerciseCard from "../commponets/exerciseCard";
import { useEx } from "../hooks/useEx";
import { useEffect, useState } from "react";
import TraineeServices from "../services/traineeServices";
import { useAuth } from "../context/auth.context";
import BizUsersService from "../services/bizUserService";
import { ACTION, usePlan } from "../context/plan.context";
import usersService from "../services/userService";


function MoreAction() {
    const { user } = useAuth()
    const EXERCISES = useEx();
    const { plan, dispatch } = usePlan();
    console.log(user)

    const location = useLocation();
    const { exerciseDetails, day, traineeId, trainee } = location.state;
    console.log(trainee)

    const [message, setMessage] = useState('')
    const [deleteMessage, setDeleteMessage] = useState('')
    const [exerciseId, setExerciseId] = useState("");
    const [sets, setSets] = useState(1);
    const [reps, setReps] = useState(1);
    const [specificDay, setSpecificDay] = useState(null);



    useEffect(() => {

        const foundDay = plan.find((d) => { return d.day === day })
        setSpecificDay(foundDay)

    }, [plan, day, location])

    if (specificDay?.length == 0) {
        console.log("in")
        return;
    }

    const handleAddToPlan = async () => {
        if (trainee) {
            const data = {
                dayName: day,
                exerciseId: exerciseId,
                sets: sets,
                reps: reps,
            };

            try {
                const response = await TraineeServices.addToTraineePlan(traineeId, data)
                setMessage('The exercises added successfully')
                setTimeout(() => { setMessage('') }, 3000)
                dispatch({ type: ACTION.SET_PLAN, payload: response.data })

            } catch (err) {
                setMessage('The exercise already exists')
                setTimeout(() => { setMessage('') }, 3000)
            }

        }

        if (!trainee) {
            const data = {
                dayName: day,
                exerciseId: exerciseId,
                sets: sets,
                reps: reps,
            };

            try {
                const response = await usersService.addExercise(user._id, data)
                setMessage('The exercises added successfully')
                setTimeout(() => { setMessage('') }, 3000)
                dispatch({ type: ACTION.SET_PLAN, payload: response.data })

            } catch (err) {
                setMessage('The exercise already exists')
                setTimeout(() => { setMessage('') }, 3000)
            }
        }
    }

    const handleDeleteFromPlam = async (info) => {

        if (trainee) {

            const data = {
                dayName: day,
                exerciseId: info.exerciseId,
            };


            try {
                const response = await TraineeServices.removeFromTraineePlan(traineeId, data);

                setDeleteMessage('The exercises deleted successfully')
                setTimeout(() => { setDeleteMessage('') }, 3000)

                dispatch({ type: ACTION.SET_PLAN, payload: response.data })
            } catch (err) {
                console.log(err)
            }
        }

        if (!trainee) {
            const data = {
                dayName: day,
                exerciseId: info.exerciseId,
            };

            try {
                const response = await usersService.removeExercise(user._id, data)
                setDeleteMessage('The exercises deleted successfully')
                setTimeout(() => { setDeleteMessage('') }, 3000)

                dispatch({ type: ACTION.SET_PLAN, payload: response.data })
            } catch (err) {
                console.log(err)
            }
        }
    }



    return <>
        <div className="text-center container p-4">
            <h2 className="m-4">Manage Plan</h2>
            {deleteMessage && <div className="alert alert-secondary">{deleteMessage}</div>}
            <div className="d-flex flex-wrap justify-content-center gap-4">
                {console.log(Object.keys(plan).length)}
                {Object.keys(plan).length > 0 && (
                    specificDay && specificDay["exercises"].map((ex, index) => {
                        return <ExerciseCard key={index} exInfo={ex} deleteFromPlan={handleDeleteFromPlam}></ExerciseCard>
                    }))
                }

            </div>

            <h3 className="m-5">Add exercise</h3>
            <form >
                {message && <div className="alert alert-secondary">{message}</div>}
                <div className="input-group m-3 " >
                    <select
                        onChange={(e) => setExerciseId(e.target.value)}
                        className="form-select"
                        id="inputGroupSelect02"
                    >
                        <option defaultValue="">Choose an exercise</option>
                        {EXERCISES.map((ex, index) => {
                            return <option key={index} value={ex._id}>{ex.name}</option>
                        })}
                    </select>
                </div>
                <div className="d-flex justify-content-center gap-3 ">
                    <label className="form-label">sets : </label>
                    <input
                        type="number"
                        min={1}
                        value={sets}
                        onChange={(e) => setSets(e.target.value)}
                        className="form-control"
                    />

                    <label htmlFor="">reps :</label>
                    <input type="number"
                        min={1}
                        value={reps}
                        onChange={(e) => setReps(e.target.value)}
                        className="form-control"
                    />
                </div>
                <button type="button" className="btn btn-dark m-5 p-2" onClick={handleAddToPlan}>Add Exercise</button>
            </form>
        </div >
    </>
}

export default MoreAction;
