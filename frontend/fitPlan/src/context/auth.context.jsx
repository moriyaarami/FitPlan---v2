import { createContext, useContext, useState } from "react"
import usersService from "../services/userService"
import BizUsersService from "../services/bizUserService";

const fn_error_context_must_be_used = () => {
    throw new Error("must use authContext provider for consumer to work");
}

export const authContext = createContext({
    user: null,
    login: fn_error_context_must_be_used,
    logout: fn_error_context_must_be_used,
    signUp: fn_error_context_must_be_used,
})
authContext.displayName = "Auth"

export function AuthProvider({ children }) {
    const [user, setUser] = useState(usersService.getUser());

    const refreshUser = () => setUser(usersService.getUser());

    const login = async (credentials) => {
        const response = await usersService.loginUser(credentials);
        refreshUser();

        return response;
    }

    const loginBiz = async (credentials) => {
        const response = await BizUsersService.loginUser(credentials);
        refreshUser();

        return response;
    }

    const logout = () => {
        usersService.logoutUser()
        refreshUser();
    }

    const logoutBiz = () => {
        BizUsersService.logoutUser()
        refreshUser()
    }


    return (
        <authContext.Provider
            value={{ user, login, logout, signUp: usersService.createUser, loginBiz, logoutBiz }}
        >
            {children}
        </authContext.Provider>
    );
}

export function useAuth() {
    return useContext(authContext);
}