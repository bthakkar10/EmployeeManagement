import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Roles } from '../_Models/Role';
import { SnackbarType } from '../_Models/Snackbar';
import { AccountService } from '../_Services/account.service';
import { SnackbarService } from '../_Shared/snackbar.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  account: any
  constructor(
    private router: Router,
    private accountService: AccountService,
    private snackbar: SnackbarService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this.account = this.accountService.Value;
    if (localStorage.getItem("Role") != null) {
      if (localStorage.getItem("Role") === Roles.Admin) {
        const url = state.url.substr(1); // Remove the leading '/' 
        return true;
      }
      else {
        console.log("User role")
        this.router.navigate(['/home']);
        this.snackbar.showSnackbar('You are not authorized to use this page', SnackbarType.Danger)
        return false
      }
    }
    this.router.navigate([''], { queryParams: { returnUrl: state.url } });
    return false;
  }

}
