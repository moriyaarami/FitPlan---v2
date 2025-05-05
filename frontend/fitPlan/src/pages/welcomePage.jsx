import PageHeader from "../commponets/common/pageHeader";


function WelcomePage({ closeModal, openModal }) {

    return <>

        <PageHeader titel={<>welcome to FitPlan</>} description="Are you registered or logged in? If not, now its the time." />
        <div className="text-center m-4">
            <button className="btn m-3 "
                style={{ backgroundColor: "#9B59B6" }}
                onClick={() => openModal('signup')}
            >Sign Up</button>
            <button className="btn m-3"
                style={{ backgroundColor: "#9B59B6" }}
                onClick={() => openModal('login')}
            > Log In</button>


        </div >
        <button className="btn btn-secondary " style={{ width: "20%", margin: "auto" }} onClick={() => closeModal()}>close</button>



    </>
}

export default WelcomePage;