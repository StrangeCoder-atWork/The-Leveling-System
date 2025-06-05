'use client';
import { createContext, useState, useContext, useEffect } from "react"

const ThemeContext= createContext();

export const ThemeProvider = ({ children}) =>{
	const [theme, setTheme] = useState("default");

	useEffect(() => {
		const saved = localStorage.getItem("theme");
		if (saved) setTheme(saved);
	}, []);

	const changeTheme= (newTheme) =>{
		setTheme(newTheme);

		localStorage.setItem("theme", newTheme);
	};

	return (
		<ThemeContext.Provider value={{theme, changeTheme}}>
			{children}
		</ThemeContext.Provider>
	)
};

export const useTheme = () =>useContext(ThemeContext);