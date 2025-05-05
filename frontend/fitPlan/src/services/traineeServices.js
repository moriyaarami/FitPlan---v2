import httpService from "./httpService";

export async function addTrainee(trainee) {
    return httpService.post('bizuser/trainee/add', trainee);

}

export async function getAllTrainees() {
    return httpService.get('bizuser/trainee/myTrainees')
}

export async function getTraineeById(id) {
    return httpService.get(`bizuser/trainee/${id}`)
}

export async function deleteTrainee(id) {
    return httpService.delete(`bizuser/trainee/${id}`)
}
export async function editTrainee(id, updateData) {
    return httpService.put(`bizuser/trainee/${id}`, updateData)
}
export async function addToTraineePlan(id, data) {
    return httpService.patch(`bizuser/trainee/addToTraineePlan/${id}`, data)
}

export async function removeFromTraineePlan(id, data) {
    return httpService.patch(`bizuser/trainee/removeFromTraineePlan/${id}`, data);
}


const TraineeServices = {
    addTrainee,
    getAllTrainees,
    deleteTrainee,
    addToTraineePlan,
    removeFromTraineePlan,
    getTraineeById,
    editTrainee
}

export default TraineeServices;