
import api from "../_Helpers/api";
import { fetchWrapper } from "../_Helpers/fetch-wrapper";

export const accountService = {
    register,
    getAllCompany,
    login,
    verifyEmail,
    forgetPassword,
    resetPassword,
    logout,
    getCurrentUser
}
function getAllCompany() {
    return fetchWrapper.get(api.CompanyAPI);
}

function register(params: any) {
    return fetchWrapper.post(api.RegisterAPI, params);
}

function verifyEmail(token: any) {
    return fetchWrapper.post(api.VerifyEmailAPI + `token=${token}`, {});
}

function forgetPassword(email: any) {
    return fetchWrapper.post(api.ForgetPasswordAPI + `email=${email}`, {});
}

function resetPassword(token: any, password: string) {
    return fetchWrapper.post(api.ResetPasswordAPI + `token=${token}&password=${password}`, {});
}

function login(email: string, password: string) {
    return fetchWrapper.post(api.LoginAPI, { email, password })
        .then(response => {
            if (response.token) {
                localStorage.setItem("user", JSON.stringify(response.user));
                localStorage.setItem("token", response.token);
            }
            // publish user to subscribers and start timer to refresh token
            // localStorage.setItem("name", response.user.firstName + " " + response.user.lastName);
            // localStorage.setItem("Role", response.user.userType);
            return response;
        });
}

function logout() {
    fetchWrapper.post(api.LogoutAPI, {});
}

function getCurrentUser() {
    const userJson = localStorage.getItem('user');
    const user = userJson !== null ? JSON.parse(userJson) : null;
    return user;
}
