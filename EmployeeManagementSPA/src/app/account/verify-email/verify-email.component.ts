import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs';
import { SnackbarType } from 'src/app/_Models/Snackbar';
import { AccountService } from 'src/app/_Services/account.service';
import { SnackbarService } from 'src/app/_Shared/snackbar.service';



@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css']
})
export class VerifyEmailComponent implements OnInit {

  VerifingEmail: boolean = true;
  VerifiedEmail: boolean = false;
  Failed: boolean = false;


  constructor(private route: ActivatedRoute,
    private router: Router,
    private account: AccountService,
    private snackbar: SnackbarService) { }

  ngOnInit() {
    const token = this.route.snapshot.queryParams['token'];
    // remove token from url to prevent http referer leakage
    this.router.navigate([], { relativeTo: this.route, replaceUrl: true });

    this.account.VerifyEmail(token)
      .pipe(first())
      .subscribe({
        next: () => {
          this.snackbar.showSnackbar('Verification successful', SnackbarType.Success);
          //this.router.navigate(['../login'], { relativeTo: this.route });
          this.VerifiedEmail = true;
          this.VerifingEmail = false;
        },
        error: () => {
          this.Failed = true;
          this.VerifingEmail = false;
        }
      });
  }
}
