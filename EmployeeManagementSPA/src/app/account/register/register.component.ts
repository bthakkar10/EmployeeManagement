import { Component, OnInit, } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs';
import { Patterns } from 'src/app/_Helpers/ValidationPattern';
import { AccountService } from 'src/app/_Services/account.service';
import { PasswordValidators } from 'src/app/_Helpers/password-validators';
import { SnackbarService } from 'src/app/_Shared/snackbar.service';
import { SnackbarType } from 'src/app/_Models/Snackbar';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],

})

export class RegisterComponent implements OnInit {
  RegisterForm!: FormGroup;
  submitting = false;
  submitted = false;
  companies!: any[];

  hide = true;
  Confirmhide = true;

  subscription$: any;

  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private snackbar: SnackbarService) {
    this.fetchCompanies();
  }

  ngOnInit(): void {
    this.RegisterForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.pattern(Patterns.Name)]],
      lastName: ['', [Validators.required, Validators.pattern(Patterns.Name)]],
      email: ['', [Validators.required, Validators.pattern(Patterns.Email)]],
      companyId: ['', Validators.required],
      contactno: ['', [Validators.required, Validators.pattern(Patterns.ContactNo)]],
      password: ['', [Validators.required, Validators.pattern(Patterns.Password)]],
      confirmPass: ['', [Validators.required, PasswordValidators.MatchValidator]]
    })

  }

  fetchCompanies() {
    this.subscription$ = this.accountService.getAll().subscribe(
      (response) => {
        this.companies = response;
      })
  }


  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.RegisterForm.invalid) {
      return;
    }
    this.submitting = true;
    this.subscription$ = this.accountService.Register(this.RegisterForm.value)
      .pipe(first())
      .subscribe({
        next: response => {
          let message = JSON.parse(JSON.stringify(response)).message;
          this.snackbar.showSnackbar(`${message}`, SnackbarType.Success);
          this.router.navigate(['/'], { relativeTo: this.route });
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
