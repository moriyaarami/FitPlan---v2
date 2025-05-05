import httpService from "./httpService";

export function createEx(ex) {
    return httpService.post('/exercise/create', ex);
}

export function updateEx(exId, ex) {
    return httpService.put(`/exercise/update/${exId}`, ex);
}

export function deleteEx(exId) {
    return httpService.delete(`/exercise/delete/${exId}`);
}

export function getAllEx() {
    return httpService.get('/exercise').then(console.log());
}

export function getExByName(exName) {
    return httpService.get(`/exercise/name?exercise=${exName}`);
}

export function getExByCategory(category) {
    return httpService.get(`/exercise/category?category=${category}`);
}

export function getExByDifficulty(difficulty) {
    return httpService.get(`/exercise/difficulty?difficulty=${difficulty}`);
}

const cardService = {
    createEx,
    updateEx,
    deleteEx,
    getAllEx,
    getExByName,
    getExByCategory,
    getExByDifficulty,
}

export default cardService;









