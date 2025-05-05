import { useEx } from "../hooks/useEx";

function ExerciseCard({ exInfo, deleteFromPlan }) {
    console.log(exInfo)

    const Exercises = useEx();
    const correctEx = Exercises.find((ex) => {
        return ex._id === exInfo.exerciseId
    })

    return correctEx && <div className="card" style={{ width: "18rem" }}>
        <div className="card-body">
            <h5 className="card-title">{correctEx.name}</h5>
            <p className="card-text">{correctEx.description}</p>
            <p className="card-text">Location: {correctEx.location}</p>
            <p className="card-text">Equipment: {correctEx.equipment}</p>
            <p className="card-text">Difficulty: {correctEx.difficulty}</p>
            <p className="card-text">Category: {correctEx.category}</p>
            <div className="d-flex  justify-content-around">
                <p className="card-text">Sets: {exInfo.sets}</p>
                <p className="card-text">Reps: {exInfo.reps}</p>
            </div>
        </div>
        <button className="btn btn-danger m-4 " onClick={() => deleteFromPlan(exInfo)}>Delete</button>
    </div >
}

export default ExerciseCard;
