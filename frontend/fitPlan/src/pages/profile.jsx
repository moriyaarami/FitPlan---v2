import { useEffect, useState } from "react";
import PageHeader from "../commponets/common/pageHeader";
import usersService from "../services/userService";
import { useAuth } from "../context/auth.context";
import { useUserInfo } from "../hooks/useUserInfo";

function Profile({ closeModal }) {
    const { userInfo, error, loading } = useUserInfo();

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>



    return <>

        <div className="container m-5">
            <div className="row justify-content-center">
                <PageHeader titel="Your Profile" description="Here you have all your profile details" />

                <div className="m-4">
                    <p>
                        <i className="bi bi-person-circle me-2"></i>
                        Name: <span className="text-dark">{userInfo.name}</span>
                    </p>
                    <p>
                        <i className="bi bi-envelope me-2"></i>
                        Email: <span className="text-dark">{userInfo.email}</span>
                    </p>
                    <p>
                        <i className="bi bi-telephone me-2"></i>
                        Phone: <span className="text-dark">{userInfo.phone}</span>
                    </p>
                    <p>
                        <i className="bi bi-bar-chart me-2"></i>
                        Trainee Level: <span className="text-dark">{userInfo.traineeLevel}</span>
                    </p>
                    <p>
                        <i className="bi bi-calendar-event me-2"></i>
                        Created At: <span className="text-dark">{new Date(userInfo.createAt).toLocaleDateString()}</span>
                    </p>
                </div>
                <div className=" text-center">
                    {/* <button className="btn m-2 " style={{ backgroundColor: "#9B59B6" }} onClick={() => openModal('edit')}>Edit Profile</button>

                    <button className="btn m-2 " style={{ backgroundColor: "#9B59B6" }} >Delete Profile</button> */}
                </div>
            </div>
            <button className="btn" style={{ backgroundColor: "#9B59B6" }} onClick={() => closeModal()} >close</button>
        </div>



    </>
}

export default Profile;