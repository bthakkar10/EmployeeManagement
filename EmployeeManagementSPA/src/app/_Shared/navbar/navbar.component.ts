import { Component } from '@angular/core';
import { Roles } from 'src/app/_Models/Role';
import { AccountService } from 'src/app/_Services/account.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  //account? : any
  currentRole : any 
  role = Roles
  constructor(private accountService: AccountService, ){
    //this.accountService.account.subscribe(x=>this.account = x);
      if (localStorage.getItem("Role") != null) {
        this.currentRole = localStorage.getItem("Role")
      }
    }
    logout() {
      this.accountService.Logout();
  }
}
