import { useEx } from "../hooks/useEx";

function ExerciseCard({ exInfo, deleteFromPlan }) {

    const Exercises = useEx();
    const correctEx = Exercises.find((ex) => {
        return ex._id === exInfo.exerciseId
    })

    return correctEx && <div className="card" style={{ width: "18rem" }}>
        <div className="card-titel">
            {correctEx.name}
        </div>
        <div className="card-subtitle mb-2 text-muted">
            {correctEx.description}
        </div>
        <div className="card-text">
            <p >Location: <span className="text-muted">{correctEx.location}</span></p>
            <p>Equipment
                : <span className="text-muted">{correctEx.equipment
                }</span></p>
            <p>Difficulty
                : <span className="text-muted">{correctEx.difficulty
                }</span></p>
            <p>Category
                : <span className="text-muted">{correctEx.category
                }</span></p>
        </div>
        <div className="d-flex  justify-content-around">
            <p className="card-text">Sets: {correctEx.sets}</p>
            <p className="card-text">Reps: {correctEx.reps}</p>
        </div>
        <button className="btn btn-danger m-4 " onClick={() => deleteFromPlan(exInfo)}>Delete</button>
    </div >
}

export default ExerciseCard;