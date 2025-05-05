
import httpService from "./httpService";
import { jwtDecode } from 'jwt-decode';


refreshToken();

function setToken(token) {
    localStorage.setItem('token', token);
    refreshToken();
}

function refreshToken() {
    httpService.setCommonHeader('x-auth-token', getJWT())
}

export function getJWT() {
    return localStorage.getItem('token');
}

export function createUser(user) {
    return httpService.post('/bizuser/signup', user)
}

export async function loginUser(user) {
    const response = await httpService.post('/bizuser/login', user).then(console.log());
    setToken(response.data.token);

    return response;
}

export function logoutUser() {
    setToken(null);
}

export function getUser() {
    try {
        const token = getJWT();
        return jwtDecode(token);
    } catch (err) {
        return null;
    }
}

export async function getUserById(id) {
    try {
        const response = await httpService.get(`/Bizuser/${id}`)
        const data = response.data;
        return data;
    } catch (err) {
        console.error(err);
        return null;
    }


}

const BizUsersService = {
    createUser,
    loginUser,
    logoutUser,
    getUser,
    getUserById,


}

export default BizUsersService;