import { authFunctions } from "./auth";

export const fetchWrapper = {
    post,
    get,
    put,
    _delete
}

function get(url: any) {
    const requestOptions = {
        method: 'GET',
        headers: authFunctions.authHeader(url)
    };
    return fetch(url, requestOptions).then(authFunctions.handleResponse);
}

function post(url: string, body: any) {
    const requestOptions = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            ...authFunctions.authHeader(url)
        },
        //headers: new Headers({ 'content-type': 'application/json' }),
        credentials: 'include' as RequestCredentials,
        body: JSON.stringify(body)
    };
    return fetch(url, requestOptions).then(authFunctions.handleResponse);
}


function put(url: any, body: any, id: number) {
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authFunctions.authHeader(url) },
        body: JSON.stringify(body)
    };
    return fetch(`${url}/${id}`, requestOptions).then(authFunctions.handleResponse);
}

// prefixed with underscored because delete is a reserved word in javascript
function _delete(url: any, id: number) {
    const requestOptions = {
        method: 'DELETE',
        headers: authFunctions.authHeader(url)
    };
    return fetch(`${url}/${id}`, requestOptions).then(authFunctions.handleResponse);
}



