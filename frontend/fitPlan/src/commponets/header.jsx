
import Navbar from "./navbar";

function Header({ openModal }) {

    return <>
        <header   >
            <Navbar openModal={openModal} />
        </header>
    </>
}

export default Header;