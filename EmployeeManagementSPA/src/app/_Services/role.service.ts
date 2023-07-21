import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API } from '../_Helpers';
import { RolePermission } from '../_Models/RolePermission';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class RoleService extends BaseService<RolePermission> {

  constructor(private httpClient: HttpClient) {
    super(httpClient, API.RolePermissionAPI);
  }

  getRolesList() {
    return this.http.get(API.GetRolesListAPI);
  }

  AddRoles(RoleName: string) {
    return this.http.post(API.RolePermissionAPI + `/${RoleName}`, {});
  }
}
