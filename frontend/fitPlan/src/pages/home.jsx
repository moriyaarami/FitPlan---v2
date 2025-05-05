
import PageHeader from "../commponets/common/pageHeader";
import Logo from "../commponets/logo";
import { useEx } from "../hooks/useEx";
import Card from "../commponets/card";
import { useEffect, useState } from "react";
import cardService from "../services/exercise";

function Home() {

    const exercises = useEx();
    console.log(exercises)

    const [serverError, setServerError] = useState('');
    const [inputValue, setInputValue] = useState(localStorage.getItem("selectedCategory") || "");
    const [showExercise, setShowExercise] = useState([]);


    useEffect(() => {

        if (inputValue) {
            handleCategorySearch(inputValue);
        } else {
            setShowExercise(exercises)
        }



    }, [exercises])

    const handleCategorySearch = async (category) => {

        try {
            const response = await cardService.getExByCategory(category);
            const filteredExercises = exercises.filter((exercise) =>
                response.data.some((ex) => ex._id === exercise._id)
            );
            setShowExercise(filteredExercises);
        } catch (err) {
            setServerError(err.message)
        }
    };

    const handleSelectChange = async (e) => {
        const selectedValue = e.target.value;
        setInputValue(selectedValue);
        localStorage.setItem("selectedCategory", selectedValue)

        if (selectedValue === "all") {
            setShowExercise(exercises);
            return;
        }

        await handleCategorySearch(selectedValue);


    }

    return <>
        <div className="container">
            <PageHeader titel={<Logo />} />
            {serverError && <div className="alert alert-danger">{serverError}</div>}
            <div className="input-group mb-3">
                <select className="form-select" id="inputGroupSelect02" value={inputValue} onChange={handleSelectChange} >
                    <option value="" disabled>Search by category</option>
                    <option value="all" >all exercises</option>
                    <option value="Core">Core</option>
                    <option value="Upper Body">Upper Body</option>
                    <option value="Lower Body">Lower Body</option>
                    <option value="Full Body">Full Body</option>
                </select>
            </div>
            <div className=" d-flex flex-wrap justify-content-center  gap-4 p-2" >


                {!showExercise.length ? (
                    <p>Loading...</p>
                ) : (showExercise.map((ex) => <Card card={ex} key={ex._id}></Card>))}

            </div >
        </div>



    </>
}

export default Home; 