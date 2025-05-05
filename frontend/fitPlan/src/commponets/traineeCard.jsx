import { NavLink } from "react-router-dom";
import TraineeServices from "../services/traineeServices";
import { useEffect, useState } from "react";
import { usePlan } from "../context/plan.context";
import { useTrainees } from "../context/trainee.context";

function TraineeCard({ traineeInfo, onUpdate }) {

    console.log("Trainee Card Render")
    /*   const { setPlan } = usePlan();
      useEffect(() => { setPlan(traineeInfo.myPlan) }, []) */
    const { deleteTrainee } = useTrainees();

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ ...traineeInfo });
    const [message, setMessage] = useState("");

    const handleSave = async () => {
        try {

            await onUpdate(traineeInfo._id, formData)

            setIsEditing(false)
            setMessage("Trainee updated successfully!");
        } catch (err) {
            console.log(err)
            console.error("Failed to update trainee:", err);
            setMessage("Failed to update trainee. Please try again.");
            setFormData(traineeInfo)
        }

        setTimeout(() => setMessage(''), 3000)

    }

    return <>
        <div className="card" style={{ width: "18rem" }}>
            {message && <div className="alert alert-info">{message}</div>}
            <div className="card-body">

                {isEditing ? (
                    <div>
                        <label htmlFor="">name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Name"
                            className="form-control mb-2"
                        />
                        <label >password</label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            placeholder="Phone"
                            className="form-control mb-2"
                        />
                        <label htmlFor="">Trainee Level</label>
                        <select
                            name="traineeLevel"
                            className="form-select"
                            id="traineeLevel"
                            required
                            onChange={(e) => setFormData({ ...formData, traineeLevel: e.target.value })}
                        >
                            <option defaultValue>Choose...</option>
                            <option value="Beginner">Beginner</option>
                            <option value="Advanced">Advanced</option>
                            <option value="Pro">Pro</option>
                        </select>
                        <button className="btn btn-success m-1" onClick={handleSave}>
                            Save
                        </button>
                        <button className="btn btn-secondary m-1" onClick={() => setIsEditing(false)}>
                            Cancel
                        </button>
                    </div>
                ) : (

                    <div>
                        <img
                            src={traineeInfo.image.url}
                            className="card-img-top"
                            alt={traineeInfo.image.alt}
                        />
                        <div className="card-title">{traineeInfo.name}</div>
                        <div className="card-subtitle">{traineeInfo.phone}</div>
                        <p className="card-text">{traineeInfo.traineeLevel}</p>
                        <button
                            className="btn btn-danger m-1"
                            onClick={() => deleteTrainee(formData._id, setMessage)}
                        >
                            Delete Trainee
                        </button>
                        <button
                            className="btn btn-danger m-1"
                            onClick={() => {
                                setIsEditing(true)
                            }}
                        >
                            Edit Trainee
                        </button>
                        <NavLink
                            state={{ traineeInfo }}
                            to="/more-info"
                            className="btn btn-dark m-4"
                        >
                            More Information
                        </NavLink>
                    </div>
                )}
            </div>
        </div>
    </>
}

export default TraineeCard;