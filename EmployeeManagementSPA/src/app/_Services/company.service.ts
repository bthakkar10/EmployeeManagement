import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { API } from '../_Helpers';
import { Company } from '../_Models/company';
import { BaseService } from './base.service';



@Injectable({
  providedIn: 'root'
})

export class CompanyService extends BaseService<Company> {
  constructor(private httpClient: HttpClient) {
    super(httpClient, API.CompanyAPI);
  }
}
