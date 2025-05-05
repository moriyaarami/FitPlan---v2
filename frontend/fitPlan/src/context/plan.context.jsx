import { createContext, useContext, useEffect, useReducer, useState } from "react";
import TraineeServices from "../services/traineeServices";
import { useAuth } from "./auth.context";

export const ACTION = {
    SET_PLAN: "set-plan",
    ADD_TO_PLAN: "add-to-plan",
    REMOVE_FROM_PLAN: "remove-from-plan",
    FETCH_PLAN: "fetch-plan"
};

const planReducer = (state, action) => {
    switch (action.type) {

        case ACTION.SET_PLAN:
            return action.payload
        case ACTION.ADD_TO_PLAN:

        case ACTION.REMOVE_FROM_PLAN:
            return state.map((day) => day.day === action.payload.dayName ? {
                ...day,
                exercises: day.exercises.filter((ex) => ex._id !== action.payload.exerciseId)
            } : day)
        default:
            throw new Error(`Unknown action type: ${action.type}`);
    }
}

const PlanContext = createContext();

export const PlanProvider = ({ children }) => {

    const [plan, dispatch] = useReducer(planReducer, []);


    /*  const fetchPlan = async (traineeId) => {
         try {
             const response = await TraineeServices.getTraineeById(traineeId)
             dispatch({ type: ACTION.SET_PLAN, payload: response.data })
         } catch (err) {
             console.log(err)
         }
 
     } */


    return (
        <PlanContext.Provider value={{
            plan,
            dispatch,
        }}>
            {children}
        </PlanContext.Provider>
    )
}

export const usePlan = () => { return useContext(PlanContext) };

