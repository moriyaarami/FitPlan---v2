import { useEffect } from "react";
import { useAuth } from "../context/auth.context";
import usersService from "../services/userService";
import PlanCard from "../commponets/planCard";
import { usePlan } from "../context/plan.context";

function MyPlan() {

    const { plan, setPlan } = usePlan();
    const { user } = useAuth();

    useEffect(() => {

        const fetchUser = async () => {
            try {
                const userInfo = await usersService.getUserById(user._id);
                setPlan(userInfo.myPlan);
            } catch (err) {
                console.log(err)
            }

        }

        fetchUser();

    }, [user])


    return <div className="container text-center p-4">
        <h3 className="p-2">My Program Plan</h3>

        <div className="d-flex flex-wrap justify-content-center gap-4">
            {
                plan.map((dayPlan, index) => {
                    return <PlanCard key={index} dayPlan={dayPlan} trainee={false} />
                })
            }
        </div>

    </div>


}

export default MyPlan;