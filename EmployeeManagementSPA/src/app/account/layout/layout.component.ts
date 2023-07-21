import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/_Services/account.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {
  constructor(
    private router: Router,
    private accountService: AccountService
) {
    // redirect to home if already logged in
    if (this.accountService.Value) {
        this.router.navigate(['/home']);
    }
}
}
