import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs';
import { Patterns } from 'src/app/_Helpers/ValidationPattern';
import { SnackbarType } from 'src/app/_Models/Snackbar';
import { AccountService } from 'src/app/_Services/account.service';
import { SnackbarService } from 'src/app/_Shared/snackbar.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  LoginForm!: FormGroup;
  submitting = false;
  submitted = false;
  hide = true;
  response: any

  title = "Login";

  subscription$: any;

  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private snackbar: SnackbarService) { }

  ngOnInit(): void {
    this.LoginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(Patterns.Email)]],
      password: ['', [Validators.required, Validators.pattern(Patterns.Password)]]
    })
  }

  OnSubmit() {
    this.submitted = true;

    if (this.LoginForm.invalid) {
      return;
    }

    this.submitting = true;
    this.subscription$ = this.accountService.Login(this.LoginForm.get('email')!.value, this.LoginForm.get('password')!.value)
      .pipe(first())
      .subscribe(
        {
          next: () => {
            // get return url from query parameters or default to home page
            const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
            if (this.accountService.Value != null) {
              this.response = this.accountService.Value;
              this.snackbar.showSnackbar(`${this.response.message}`, SnackbarType.Success);
            }
            this.router.navigateByUrl(returnUrl);
          },
          error: () => {
            this.submitting = false;
          }
        });
  }

  ngOnDestroy() {
    if (this.subscription$) {
      this.subscription$.unsubscribe();
    }
  }

}
