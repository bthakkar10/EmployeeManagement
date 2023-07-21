import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API } from '../_Helpers';
import { RolePermission } from '../_Models/RolePermission';
import { User } from '../_Models';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService<User> {

  constructor(private httpClient: HttpClient) {
    super(httpClient, API.UserAPI);
  }

  getUserBasedOnCompany(CompanyId: number) {
    return this.http.get(API.GetUsersAPI + `${CompanyId}`, {});
  }

  getCompanyList() {
    return this.http.get(API.CompanyAPI);
  }

  getRolesList() {
    return this.http.get(API.GetRolesListAPI);
  }

  getPermissionById(RoleId: any): Observable<RolePermission> {
    //const url = `${this.baseUrl}/${id}`;
    return this.http.get<RolePermission>(`${API.RolePermissionAPI}/${RoleId}`)
  }

}
