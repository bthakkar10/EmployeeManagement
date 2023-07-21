import api from "../_Helpers/api";
import { fetchWrapper } from "../_Helpers/fetch-wrapper";

export const roleService = {
    getRolePermission,
    getRolesList,
    getRolePermissionList,
    editRolePermission
};
//used in user to show add/edit/delete buttons based on permissions 
function getRolePermission(RoleId: number) {
    return fetchWrapper.get(`${api.RolePermissionAPI}/${RoleId}`);
}
function getRolesList() {
    return fetchWrapper.get(api.GetRolesListAPI);
}
function getRolePermissionList() {
    return fetchWrapper.get(api.RolePermissionAPI);
}
function editRolePermission(data: any, id: any) {
    return fetchWrapper.put(api.RolePermissionAPI, data, id);
}