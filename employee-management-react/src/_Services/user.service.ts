import api from "../_Helpers/api";
import { fetchWrapper } from "../_Helpers/fetch-wrapper";

export const userService = {
    getAllUsers,
    getUsersBasedOnCompany,
    getRolesList,
    getUserById,
    addUser,
    updateUser,
    deleteUser,
}

function getAllUsers() {
    return fetchWrapper.get(api.UserAPI);
}

function getUsersBasedOnCompany(CompanyId: any) {
    return fetchWrapper.get(api.GetUsersAPI + `${CompanyId}`);
}

function getRolesList() {
    return fetchWrapper.get(api.GetRolesListAPI);
}

function getUserById(id: number) {
    return fetchWrapper.get(`${api.UserAPI}/${id}`);
}
function addUser(data: any) {
    return fetchWrapper.post(api.UserAPI, data);
}

function updateUser(data: any, id: any) {
    return fetchWrapper.put(api.UserAPI, data, id);
}

function deleteUser(id: number) {
    return fetchWrapper._delete(api.UserAPI, id);
}

