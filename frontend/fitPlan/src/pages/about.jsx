import React from "react";
import PageHeader from '../commponets/common/pageHeader'
const About = () => {
    return (
        <div className="container mt-5">
            <PageHeader titel="About FitPlan"></PageHeader>
            <div className="row justify-content-center">
                <div className="col-md-8">

                    <div className="card-body">

                        <p className="card-text text-dark">
                            FitPlan is a dynamic and user-friendly fitness management
                            platform designed to cater to both individual users and business
                            professionals. It allows users to create and manage personalized
                            workout plans effortlessly.
                        </p>
                        <h2 className="mt-4 text-dark">Key Features</h2>
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item">
                                <strong>Individual Users:</strong> Create personal workout
                                plans and manage exercises for each day.
                            </li>
                            <li className="list-group-item">
                                <strong>Business Users:</strong> Manage clients and design
                                workout plans tailored to their needs.
                            </li>
                        </ul>
                        <h2 className="mt-4 text-dark">Technologies Used</h2>
                        <p className="text-dark">
                            The platform leverages cutting-edge technologies including:
                        </p>
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item">React for front-end development.</li>
                            <li className="list-group-item">Node.js and Express for the back-end server.</li>
                            <li className="list-group-item">MongoDB for database management.</li>
                        </ul>
                        <p className="text-dark mt-4">
                            FitPlan is your ultimate tool for achieving your fitness goals
                            and managing clients with ease. Join us today and transform the
                            way you approach fitness!
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default About;
