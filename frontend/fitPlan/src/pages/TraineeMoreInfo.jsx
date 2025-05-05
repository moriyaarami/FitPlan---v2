import { useLocation } from "react-router-dom";
import { ACTION, usePlan } from "../context/plan.context";
import { useEffect } from "react";
import PlanCard from '../commponets/planCard'

function TraineeInfo() {

    const location = useLocation();
    const { traineeInfo } = location.state;

    const traineeId = traineeInfo._id;

    const { plan, dispatch } = usePlan();

    useEffect(() => { dispatch({ type: ACTION.SET_PLAN, payload: traineeInfo.myPlan }) }, [location])



    return (
        <>
            <div className="text-center container p-4">
                <h3 className="p-2 ">Program Plan</h3>
                <div className="d-flex flex-wrap justify-content-center gap-4">
                    {plan.map((day, index) => {

                        return <PlanCard key={index} info={day} traineeId={traineeId}></PlanCard>
                    })}
                </div>
            </div>
        </>
    )

}

export default TraineeInfo;