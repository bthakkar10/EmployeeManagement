import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AccountService } from '../_Services/account.service';
import { SnackbarService } from '../_Shared/snackbar.service';
import { SnackbarType } from '../_Models/Snackbar';



@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    error?: Error
    constructor(private accountService: AccountService, private snackbar: SnackbarService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if ([401, 403].includes(err.status)) {
                this.snackbar.showSnackbar('You are not authorized to use this page', SnackbarType.Danger);
                // auto logout if 401 or 403 response returned from api
                //this.accountService.Logout();
            }
            this.error = (err && err.error && err.error.message) || err.statusText;

            console.error(err);
            this.snackbar.showSnackbar(`${err.error.message}`, SnackbarType.Danger);
            return throwError(() => err);
        }))
    }
}