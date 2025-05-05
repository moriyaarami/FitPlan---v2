import { createContext, useContext, useEffect, useState } from "react";

const themeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem("theme") || "light";
    });

    useEffect(() => {
        document.body.classList.toggle("light", theme === "light");
        document.body.classList.toggle("dark", theme === "dark");
        localStorage.setItem("theme", theme);
    }, [theme])

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
    };

    return (
        <themeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </themeContext.Provider>
    )
}

export const useTheme = () => useContext(themeContext);