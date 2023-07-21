import { environment } from "src/environments/environment";

const baseUrl = `${environment.apiUrl}`;

export const API = {
    RegisterAPI: `${baseUrl}/Register`,
    LoginAPI: `${baseUrl}/Login`,
    GetDetailsAPI: `${baseUrl}/GetDetails`,
    VerifyEmailAPI: `${baseUrl}/verify-email?`,
    LogoutAPI: `${baseUrl}/Logout`,
    ForgetPasswordAPI: `${baseUrl}/forget-password?`,
    ResetPasswordAPI: `${baseUrl}/reset-password?`,

    CompanyAPI: `${environment.apiUrl}/Companies`,

    UserAPI: `${environment.apiUrl}/User`,

    RolePermissionAPI: `${environment.apiUrl}/RolePermission`,

    //to get users list based on its company only(used in users page)
    GetUsersAPI: `${environment.apiUrl}/User/Get/`,

    // to get roles list 
    GetRolesListAPI: `${environment.apiUrl}/RolePermission/GetRoles`,
}
