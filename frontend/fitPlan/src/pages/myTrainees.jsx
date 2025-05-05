import { useState, useEffect } from "react";
import { useAuth } from "../context/auth.context";
import TraineeCard from "../commponets/traineeCard";
import TraineeServices from "../services/traineeServices";
import { NavLink } from "react-router-dom";
import { useTrainees } from "../context/trainee.context";


function MyTrainess() {

    const { trainees, fetchTrainees, editTrainee } = useTrainees();

    useEffect(() => {
        fetchTrainees();
    }, [])

    console.log(trainees)

    const handleUpdate = async (traineeId, updatedTrainee) => {
        try {

            await editTrainee(traineeId, updatedTrainee);

        } catch (err) {
            throw new Error("Validation failed or server error.");
        }

    }


    return <div className="conrtainer text-center m-4">
        <h3 className="m-4">My Trainees</h3>
        <div>
            {(trainees === undefined || trainees.length == 0) ? (<h6>You have not trainees yet.</h6>) : (
                <div className="d-flex flex-wrap justify-content-center gap-4">

                    {trainees && trainees.length > 0 && trainees.map((trainee, index) => {

                        return <TraineeCard
                            key={index}
                            traineeInfo={trainee.traineeId}
                            onUpdate={handleUpdate}
                        />
                    })}
                </div>
            )}
        </div>
        <NavLink to='/add-trainee' className="btn btn-dark m-5" >Add Trainee</NavLink>
    </div>


}

export default MyTrainess;