import { useTheme } from '../context/themeContext';
import '../styles/logo.css'
function Logo() {
    const { theme } = useTheme();
    const mode = theme === 'dark' ? 'dark' : 'light';

    return (
        <div >
            <p className="logo " id={mode}>F<span>it</span>P<span>lan</span></p>
        </div>
    )
}

export default Logo;