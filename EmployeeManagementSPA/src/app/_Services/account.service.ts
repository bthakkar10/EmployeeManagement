import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { API } from '../_Helpers/api';
import { Account } from '../_Models/account';
import { BaseService } from './base.service';


@Injectable({
  providedIn: 'root'
})
export class AccountService extends BaseService<Account>{
  private accountSubject: BehaviorSubject<Account | null>;
  public account: Observable<Account | null>;

  constructor(private route: Router, private httpClient: HttpClient) {
    super(httpClient, API.CompanyAPI);
    this.accountSubject = new BehaviorSubject<Account | null>(null);
    this.account = this.accountSubject.asObservable();

    // Check if a token exists in localStorage on initialization
    const token = localStorage.getItem('token');
    if (token) {
      this.accountSubject.next({ token });
    }
  }

  public get Value() {
    return this.accountSubject.value;
  }

  Register(account: Account) {
    return this.httpClient.post(API.RegisterAPI, account);
  }

  VerifyEmail(token: string) {
    return this.httpClient.post(API.VerifyEmailAPI + `token=${token}`, {});
  }

  Login(email: string, password: string) {
    return this.httpClient.post<any>(API.LoginAPI, { email, password }, { withCredentials: true })
      .pipe(map(account => {
        this.accountSubject.next(account);
        localStorage.setItem("token", account.token);
        localStorage.setItem("name", account.user.firstName + " " + account.user.lastName);
        localStorage.setItem("Role", account.user.userType);
        localStorage.setItem("CompanyId", account.user.companyId);
        localStorage.setItem("RoleId", account.user.roleId)
        return account;
      }));
  }

  // public getAccountDetails(token: string) {
  //   // Make a request to retrieve the user's account details using the token
  //   this.http.get<any>(`${baseUrl}/GetAccountDetails`, { headers: { Authorization: `Bearer ${token}` } })
  //     .subscribe(
  //       (account) => {
  //         this.accountSubject.next(account);
  //       },
  //       (error) => {
  //         console.log('Error retrieving account details:', error);
  //       }
  //     );
  // }

  Logout() {
    this.http.post<any>(API.LogoutAPI, {}, { withCredentials: true }).subscribe();
    this.accountSubject.next(null);
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("CompanyId");
    localStorage.removeItem("Role");
    localStorage.removeItem("RoleId");
    this.route.navigate(['']);
  }

  forgetPassword(email: string) {
    return this.http.post(API.ForgetPasswordAPI + `email=${email}`, {});
  }
  resetPassword(token: string, password: string) {
    return this.http.post(API.ResetPasswordAPI + `token=${token}&password=${password}`, {});
  }
}
