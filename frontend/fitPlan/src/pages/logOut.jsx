import PageHeader from "../commponets/common/pageHeader";
import { useAuth } from "../context/auth.context";
import '../styles/form.css'


function LogOut({ closeModal }) {
    const { logout } = useAuth();
    const handleSubmit = (e) => {
        e.preventDefault();
        logout();
        window.location.replace('/')
        closeModal();
    }

    return <>
        <PageHeader titel="Log-Out" description="Are you sure you want log out?"></PageHeader>
        <div className="text-center">
            <button id="closeButton" className="btn btn-dark m-5" onClick={handleSubmit}>Log Out</button>
        </div>
    </>
}

export default LogOut;