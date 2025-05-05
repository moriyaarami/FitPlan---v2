
import '../styles/toggle.css';
import { useTheme } from "../context/themeContext"

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return <>
        <div id='toggle ' >
            <input type="checkbox" id="darkmode-toggle" onChange={toggleTheme} checked={theme === "dark"} />
            <label htmlFor="darkmode-toggle" id='toggle-label'></label>
        </div>
    </>
}

export default ThemeToggle