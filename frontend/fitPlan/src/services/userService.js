
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
    return httpService.post('/user/signup', user)
}

export async function loginUser(user) {
    const response = await httpService.post('/user/login', user);
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
        const response = await httpService.get(`/user/${id}`)
        const data = response.data;
        return data;
    } catch (err) {
        console.error(err);
        return null;
    }


}

export function updateUser(id, user) {
    return httpService.put(`/user/${id}`, user)
}

export function deleteUser(id) {
    httpService.delete(`/user/${id}`).then(res => console.log(res));

}

export function addExercise(id, data) {
    return httpService.patch(`/user/addToMyPlan/${id}`, data)
}

export function removeExercise(id, data) {
    return httpService.patch(`/user/removeFromMyPlan/${id}`, data)
}

const usersService = {
    createUser,
    loginUser,
    logoutUser,
    getUser,
    getUserById,
    addExercise,
    removeExercise
}

export default usersService;