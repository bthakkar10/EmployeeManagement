import { accountService } from "../_Services/account.service";
import { baseUrl } from "./api";

export const authFunctions = {
    handleResponse,
    authHeader

}

function handleResponse(response: any) {
    return response.text().then((text: string) => {
        const data = text && JSON.parse(text);
        // //set alert message
        // const { setAlert } = useAlertContext();

        if (!response.ok) {
            if ([401, 403].includes(response.status)) {
                // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
                //accountService.logout();
                console.log("unautorized access!!");
                // setAlert({ type: 'error', message: 'You are not authorized!!' });
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}

function authHeader(url: any) {
    const user = accountService.getCurrentUser();
    const token = localStorage.getItem("token");
    const isApiUrl = url.startsWith(baseUrl);
    if (user && token && isApiUrl) {
        return { Authorization: 'Bearer ' + token };
    }
}