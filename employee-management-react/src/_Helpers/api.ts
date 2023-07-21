import config from "../config";

export const baseUrl = `${config.apiUrl}`;
const api = {
    RegisterAPI: `${baseUrl}/Register`,
    LoginAPI: `${baseUrl}/Login`,
    LogoutAPI: `${baseUrl}/Logout`,
    VerifyEmailAPI: `${baseUrl}/verify-email?`,
    ForgetPasswordAPI: `${baseUrl}/forget-password?`,
    ResetPasswordAPI: `${baseUrl}/reset-password?`,
    CompanyAPI: `${baseUrl}/Companies`,
    UserAPI: `${baseUrl}/User`,

    RolePermissionAPI: `${baseUrl}/RolePermission`,

    //to get users list based on its company only(used in users page)
    GetUsersAPI: `${baseUrl}/User/Get/`,

    // to get roles list 
    GetRolesListAPI: `${baseUrl}/RolePermission/GetRoles`,
}
export default api;
