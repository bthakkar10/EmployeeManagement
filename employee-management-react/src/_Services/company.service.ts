import api from "../_Helpers/api";
import { fetchWrapper } from "../_Helpers/fetch-wrapper";

export const companyService = {
    getAllCompany,
    addCompany,
    getCompanyById,
    updateCompany,
    deleteCompany
}

function getAllCompany() {
    return fetchWrapper.get(api.CompanyAPI);
}

function addCompany(data: any) {
    return fetchWrapper.post(api.CompanyAPI, data);
}

function updateCompany(data: any, id: any) {
    return fetchWrapper.put(api.CompanyAPI, data, id);
}

function getCompanyById(id: number) {
    return fetchWrapper.get(`${api.CompanyAPI}/${id}`);
}

function deleteCompany(id: number) {
    return fetchWrapper._delete(api.CompanyAPI, id);
}