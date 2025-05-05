import { NavLink } from "react-router-dom";
import { useEx } from "../hooks/useEx";
import { ACTION, usePlan } from "../context/plan.context";
import MoreAction from "../pages/moreActions";
import { useEffect, useState } from "react";
import TraineeServices from "../services/traineeServices";

function PlanCard({ info, traineeId }) {

    const day = info.day;

    const exercisesFromServer = useEx();
    const { plan, dispatch } = usePlan();
    const [exerciseDetails, setExerciseDetails] = useState([]);

    const fetchPlan = async () => {
        try {
            const response = await TraineeServices.getTraineeById(traineeId);
            dispatch({ type: ACTION.SET_PLAN, payload: response.data[0].myPlan })
        } catch (err) {
            console.log(err)
        }
    }
    useEffect(() => { fetchPlan() }, [])


    useEffect(() => {
        const updatedExerciseDetails = (info.exercises).map((ex) => {
            const exerciseFromServer = exercisesFromServer.find((exercise) => exercise._id === ex.exerciseId);

            if (exerciseFromServer) {
                return {
                    ...exerciseFromServer,
                    sets: ex.sets,
                    reps: ex.reps,
                }
            }
            return null;
        }).filter((ex) => ex !== null);

        setExerciseDetails(updatedExerciseDetails)
    }, [info.exercises, exercisesFromServer])





    return <>
        <div className="card" style={{ width: "18rem" }}>
            <div className="card-body">
                <div className="card-titel">
                    {info.day}
                </div>
                <div className="card-subtitle mb-2 text-muted">Your workout for this day</div>
                <div className="card-text">
                    {
                        (exerciseDetails === undefined || exerciseDetails.length === 0) ? (<p>No exercises added yet.</p>) :
                            exerciseDetails.map((ex, index) => {
                                return <li key={index}>{ex.name}</li>
                            })
                    }
                </div>
            </div>
            <NavLink to="/more-actions" state={{ exerciseDetails, day, traineeId }} className="btn btn-dark mt-3" >Manage Exercises</NavLink>




        </div >
    </>

}

export default PlanCard;