import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, first } from 'rxjs';
import { PasswordValidators, Patterns } from 'src/app/_Helpers';
import { SnackbarType } from 'src/app/_Models/Snackbar';
import { AccountService } from 'src/app/_Services/account.service';
import { SnackbarService } from 'src/app/_Shared/snackbar.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  title = "Reset Password"
  submitting = false;
  submitted = false;
  ResetPass!: FormGroup;
  response: any

  hide = true;
  Confirmhide = true;

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, private accountService: AccountService, private snackbar: SnackbarService) { }
  ngOnInit(): void {
    this.ResetPass = this.formBuilder.group({
      password: ['', [Validators.required, Validators.pattern(Patterns.Password)]],
      confirmPass: ['', [Validators.required, PasswordValidators.MatchValidator]]
    })
  }

  OnSubmit() {
    const token = this.route.snapshot.queryParams['token'];
    // remove token from url to prevent http referer leakage
    this.router.navigate([], { relativeTo: this.route, replaceUrl: true });
    const password = this.ResetPass.get('password')?.value;

    this.accountService.resetPassword(token, password)
      .pipe(first())
      .pipe(finalize(() => this.submitting = false))
      .subscribe({
        next: response => {
          let message = JSON.parse(JSON.stringify(response)).message;
          this.snackbar.showSnackbar(`${message}`, SnackbarType.Success);
          this.router.navigate([''], { relativeTo: this.route });
        },
        error: error => {
          this.submitting = false;
        }
      });
  }

}
