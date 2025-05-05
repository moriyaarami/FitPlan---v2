import Logo from "./logo"
import { Link, NavLink } from 'react-router-dom'
import ThemeToggle from "./themeToggle"
import { useTheme } from "../context/themeContext"
import { useAuth } from "../context/auth.context"


function Navbar({ openModal }) {
    const { theme } = useTheme();
    const mode = theme === 'dark' ? 'dark' : 'light';
    let Navstyle;
    let Buttonstyle;
    if (mode === 'light') {
        Navstyle = 'navbar-light bg-light'
        Buttonstyle = 'btn btn-light'
    } else {
        Navstyle = 'navbar-dark bg-dark'
        Buttonstyle = 'btn btn-dark'
    }

    const { user } = useAuth();


    return <>
        <nav className={["navbar navbar-expand-sm shadow-sm", Navstyle].filter(Boolean).join(' ')} aria-label="Second navbar example">
            <div className="container">
                <ThemeToggle />
                <Link to="/" className="navbar-brand" ><Logo /></Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarsExample02" aria-controls="navbarsExample02" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarsExample02">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <NavLink to="/" className="nav-link" aria-current="page" >Home</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/about" className="nav-link" >About</NavLink>
                        </li>

                        {user && (
                            user.biz ? (
                                <li className="nav-item">
                                    <NavLink to='/my-trainees' className="nav-link">
                                        My Trainees
                                    </NavLink>
                                </li>
                            ) : (
                                <li className="nav-item">
                                    <NavLink to='/my-plan' className="nav-link">
                                        My Plan
                                    </NavLink>
                                </li>)
                        )}
                    </ul>

                    <ul className="navbar-nav ms-auto ">

                        {
                            !user ? <>
                                <li className="nav-item">
                                    <button className={["btn", Buttonstyle].filter(Boolean).join(" ")}
                                        onClick={() => openModal('signup')}>Sign-Up</button>
                                </li>
                                <li className="nav-item">
                                    <button className={["btn", Buttonstyle].filter(Boolean).join(" ")}
                                        onClick={() => openModal('login')}>Log-In</button>
                                </li></> : <>
                                <li className="nav-item">
                                    <button className={["btn mx-2", Buttonstyle].filter(Boolean).join(" ")}
                                        onClick={() => openModal('logout')}>Log-Out</button>
                                </li>
                            </>
                        }



                    </ul>
                </div>
            </div>
        </nav >
    </>
}

export default Navbar