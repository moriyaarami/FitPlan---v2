import { useTheme } from '../context/themeContext';
import Logo from './logo'

function Footer() {
    const { theme } = useTheme();
    const mode = theme === 'dark' ? 'dark' : 'light';

    return <>
        <footer className='border-top py-2 text-center d-flex  justify-content-between ' style={{ backgroundColor: "#A569BD", color: '#000' }} id={mode}>
            <div className='d-flex flex-row ' >
                <span className='px-2' ><Logo /></span>
            </div>

            <div className='d-flex justify-content-evenly'>
                <span className='p-2'>
                    <a href="" target='_blank' rel="noopener noreferrer" className='link-dark'>
                        <i className="bi bi-facebook"></i>
                    </a>
                </span>
                <span className='p-2'>
                    <a href="http://www.instagram.com/moriya.arami" target='_blank' rel="noopener noreferrer" className='link-dark'>
                        <i className="bi bi-instagram"></i>
                    </a>
                </span>
                <span className='p-2'>
                    <a href="https://www.linkedin.com/in/moriya-arami/" target='_blank' rel="noopener noreferrer" className='link-dark'>
                        <i className="bi bi-linkedin"></i>
                    </a>
                </span>
            </div>

            <div className='p-2 dark'>
                <span>Moriya</span>
                <span className='mx-2'>&copy;</span>
                <span>{new Date().getFullYear()}</span>
            </div>

        </footer>
    </>
}

export default Footer;