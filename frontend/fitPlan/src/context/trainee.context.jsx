import { createContext, useContext, useEffect, useReducer } from "react"
import TraineeServices from "../services/traineeServices";
import { useAuth } from "./auth.context";

const TraineesContext = createContext();

const ACTION = {
    SET_TRAINEES: 'set-trainees',
    ADD_TRAINEE: 'add-trainee',
    EDIT_TRAINEE: 'edit-trainee',
    REMOVE_TRAINEE: 'remove-trainee'
}

const traineesReducer = (state, action) => {


    switch (action.type) {
        case ACTION.SET_TRAINEES:
            return action.payload;
        case ACTION.ADD_TRAINEE:
            return [...state, action.payload];
        case ACTION.REMOVE_TRAINEE:
            const updatedState = state.filter((trainee) => trainee.traineeId._id !== action.payload);

            return updatedState;
        case ACTION.EDIT_TRAINEE:

            return state.map((trainee) => {
                trainee.traineeId._id === action.payload._id ? { ...trainee, traineeId: { ...action.payload } } : trainee
            }


            );
        default:
            throw new Error(`Unknown action type: ${action.type}`);

    }
}

export const TraineesProvider = ({ children }) => {

    const [trainees, dispatch] = useReducer(traineesReducer, []);

    const { user } = useAuth();
    const fetchTrainees = async () => {
        try {
            const response = await TraineeServices.getAllTrainees(user._id);
            const normalizedTrainees = response.data.map(normalizeTrainee);
            dispatch({ type: ACTION.SET_TRAINEES, payload: normalizedTrainees })
        } catch (err) {
            console.error("Failed to fetch trainees:", err)
        }

    };
    useEffect(() => {
        if (user) {
            fetchTrainees()
        }

    }, [user])




    const normalizeTrainee = (trainee) => {
        return trainee.traineeId ? { ...trainee } : { traineeId: { ...trainee } };
    };

    const addTrainee = async (values, resetForm, setMessage, setServerError) => {
        try {
            const payload = { ...values };
            if (payload.image) {
                if (!payload.image.url) {
                    delete payload.image.url;
                }
                if (!payload.image.alt) {
                    delete payload.image.alt;
                }
            }

            const response = await TraineeServices.addTrainee(payload);

            const newTrainee = {
                traineeId: response.data.traineeId || { ...response.data },
            };

            dispatch({ type: ACTION.ADD_TRAINEE, payload: newTrainee });
            setMessage('Trainee added successfully');
            setTimeout(() => {
                setMessage("");
                resetForm();
            }, 3000)
        } catch (err) {
            if (err.response?.status === 400) {
                setServerError(err.response.data)
                setTimeout(() => {
                    setServerError("");
                }, 5000)
            }
        }

    }

    const deleteTrainee = async (traineeId) => {

        try {
            await TraineeServices.deleteTrainee(traineeId);
            dispatch({ type: ACTION.REMOVE_TRAINEE, payload: traineeId })

        } catch (err) {
            console.error(err)
        }

    }

    const editTrainee = async (traineeId, data) => {

        const payload = {
            name: data.name,
            traineeLevel: data.traineeLevel,
            image: data.image,
            password: data.password,
        };

        try {
            await TraineeServices.editTrainee(traineeId, payload);
            const response = await TraineeServices.getAllTrainees(user._id);
            const normalizedTrainees = response.data.map(normalizeTrainee);

            dispatch({ type: ACTION.SET_TRAINEES, payload: normalizedTrainees });

        } catch (err) {
            console.error("Failed to edit trainee:", err);
            throw err;
        }



    }


    return (
        <TraineesContext.Provider value={{ trainees, fetchTrainees, addTrainee, deleteTrainee, editTrainee }}>
            {children}
        </TraineesContext.Provider>
    )
}
export const useTrainees = () => { return useContext(TraineesContext) }
