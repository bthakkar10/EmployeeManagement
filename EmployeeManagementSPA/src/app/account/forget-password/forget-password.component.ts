import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize, first } from 'rxjs';
import { Patterns } from 'src/app/_Helpers/ValidationPattern';
import { SnackbarType } from 'src/app/_Models/Snackbar';
import { AccountService } from 'src/app/_Services/account.service';
import { SnackbarService } from 'src/app/_Shared/snackbar.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {
  title = "Forget Password "
  submitting = false;
  submitted = false;
  ForgetPass!: FormGroup;
  //response : any

  constructor(private formBuilder: FormBuilder, private accountService: AccountService, private snackbar: SnackbarService) { }

  ngOnInit(): void {
    this.ForgetPass = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(Patterns.Email)]],
    })
  }

  OnSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.ForgetPass.invalid) {
      return;
    }
    this.submitting = true;

    this.accountService.forgetPassword(this.ForgetPass.get('email')!.value)
      .pipe(first())
      .pipe(finalize(() => this.submitting = false))
      .subscribe({
        next: response => {
          let message = JSON.parse(JSON.stringify(response)).message;
          this.snackbar.showSnackbar(`${message}`, SnackbarType.Success);
          console.log(response)
        },
        error: () => {
          this.submitting = false;
        }
      });
  }
}
