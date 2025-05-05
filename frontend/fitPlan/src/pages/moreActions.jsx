import { useLocation } from "react-router-dom";
import ExerciseCard from "../commponets/exerciseCard";
import { useEx } from "../hooks/useEx";
import { useEffect, useState } from "react";
import TraineeServices from "../services/traineeServices";
import { useAuth } from "../context/auth.context";
import BizUsersService from "../services/bizUserService";
import { ACTION, usePlan } from "../context/plan.context";


function MoreAction() {

    const EXERCISES = useEx();
    const { plan, dispatch } = usePlan();

    const location = useLocation();
    const { exerciseDetails, day, traineeId } = location.state;
    console.log(day)

    const [exerciseId, setExerciseId] = useState("");
    const [sets, setSets] = useState(1);
    const [reps, setReps] = useState(1);
    const [specificDay, setSpecificDay] = useState(null);

    console.log(plan)

    useEffect(() => {

        const foundDay = plan.find((d) => { return d.day === day })
        console.log(foundDay)
        setSpecificDay(foundDay)
        localStorage.setItem('specificDay', JSON.stringify(foundDay))
    }, [plan, day, location])

    if (specificDay?.length == 0) {
        console.log("in")
        return;
    }

    const handleAddToPlan = async () => {
        const data = {
            dayName: day,
            exerciseId: exerciseId,
            sets: sets,
            reps: reps,
        };

        try {
            const response = await TraineeServices.addToTraineePlan(traineeId, data)

            dispatch({ type: ACTION.SET_PLAN, payload: response.data })

        } catch (err) {

        }

    }

    const handleDeleteFromPlam = async (info) => {

        const data = {
            dayName: day,
            exerciseId: info.exerciseId,
        };


        try {
            const response = await TraineeServices.removeFromTraineePlan(traineeId, data);


            dispatch({ type: ACTION.SET_PLAN, payload: response.data })
        } catch (err) {
            console.log(err)
        }
    }



    return <>
        <div className="text-center container p-4">
            <h1>Manage Plan</h1>
            <div className="d-flex flex-wrap justify-content-center gap-4">
                {console.log(specificDay)}
                {
                    specificDay && specificDay["exercises"].map((ex, index) => {
                        return <ExerciseCard key={index} exInfo={ex} deleteFromPlan={handleDeleteFromPlam}></ExerciseCard>
                    })
                }

            </div>

            <h3 className="m-5">Add exercise</h3>
            <form >
                {/* {message && <div className="alert alert-secondary">{message}</div>} */}
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