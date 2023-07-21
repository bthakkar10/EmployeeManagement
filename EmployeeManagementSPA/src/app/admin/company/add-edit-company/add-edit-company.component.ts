import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs';
import { Patterns } from 'src/app/_Helpers';
import { Company } from 'src/app/_Models/company';
import { SnackbarType } from 'src/app/_Models/Snackbar';
import { CompanyService } from 'src/app/_Services/company.service';
import { SnackbarService } from 'src/app/_Shared/snackbar.service';

@Component({
  selector: 'app-add-edit-company',
  templateUrl: './add-edit-company.component.html',
  styleUrls: ['./add-edit-company.component.css']
})

export class AddEditCompanyComponent implements OnInit {
  AddEditCompanyForm!: FormGroup;
  EditData!: Company;
  submitting = false;
  loading = false;
  submitted = false;
  title!: string;
  id?: number;

  subscription$: any;

  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private companyService: CompanyService,
    private snackbar: SnackbarService) { }

  ngOnInit(): void {
    this.AddEditCompanyForm = this.fb.group({
      companyName: ['', [Validators.required]],
      companyEmail: ['', [Validators.required, Validators.pattern(Patterns.Email)]],
      companyContact: ['', [Validators.required, Validators.pattern(Patterns.ContactNo)]],
      companyDetails: ['', Validators.required],
    });

    this.id = this.route.snapshot.params['id'];

    this.title = 'Add Company';
    if (this.id) {
      // edit mode
      this.title = 'Edit Company';
      this.loading = true;
      this.subscription$ = this.companyService.getById(this.id)
        .pipe(first())
        .subscribe(x => {
          this.AddEditCompanyForm.patchValue(x);
          this.loading = false;
        });
    }

  }

  OnSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.AddEditCompanyForm.invalid) {
      return;
    }

    this.submitting = true;

    // create or update company based on id param
    if (this.id) {
      this.EditData = this.AddEditCompanyForm.value;
      console.log(this.EditData)
      this.subscription$ = this.companyService.update(this.id, this.EditData)
        .pipe(first())
        .subscribe({
          next: response => {
            let message = JSON.parse(JSON.stringify(response)).message;
            this.snackbar.showSnackbar(`${message}`, SnackbarType.Success);
          },
          error: error => {
            this.snackbar.showSnackbar(`${error}`, SnackbarType.Danger);

          },
        });
      this.submitting = false;
    } else {
      this.subscription$ = this.companyService.add(this.AddEditCompanyForm.value)
        .pipe(first())
        .subscribe({
          next: response => {
            let message = JSON.parse(JSON.stringify(response)).message;
            this.snackbar.showSnackbar(`${message}`, SnackbarType.Success);
          },
        });
      this.submitting = false;
    }
  }

  ngOnDestroy() {
    if (this.subscription$) {
      this.subscription$.unsubscribe();
    }
  }

}
