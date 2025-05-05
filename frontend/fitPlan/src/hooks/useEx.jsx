import { useEffect, useState } from "react"
import cardService from "../services/exercise";

export const useEx = () => {
    const [exercises, setExercises] = useState([]);

    useEffect(() => {
        const getExs = async () => {
            const { data } = await cardService.getAllEx();
            setExercises(data);
        };

        getExs();
    }, []);

    return exercises;
}