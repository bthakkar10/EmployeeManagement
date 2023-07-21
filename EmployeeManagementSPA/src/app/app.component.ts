import { Component } from '@angular/core';
import { Account } from './_Models/account';
import { AccountService } from './_Services/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'EmployeeManagementSPA';
  account?: Account | null;
  LoggedIn = false;
  subscription$;

  constructor(private accountService: AccountService) {
    this.subscription$ = this.accountService.account.subscribe(x => this.account = x);
    if (this.account?.token != null) {
      this.LoggedIn = true;
    }
  }

  ngOnDestroy() {
    if (this.subscription$) {
      this.subscription$.unsubscribe();
    }
  }
}
