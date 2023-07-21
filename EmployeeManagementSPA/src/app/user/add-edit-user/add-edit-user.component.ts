import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { first } from 'rxjs';
import { PasswordValidators, Patterns } from 'src/app/_Helpers';
import { Roles, User } from 'src/app/_Models';
import { SnackbarType } from 'src/app/_Models/Snackbar';
import { UserService } from 'src/app/_Services/user.service';
import { SnackbarService } from 'src/app/_Shared/snackbar.service';

@Component({
  selector: 'app-add-edit-user',
  templateUrl: './add-edit-user.component.html',
  styleUrls: ['./add-edit-user.component.css']
})
export class AddEditUserComponent implements OnInit {
  AddEditUserForm!: FormGroup;
  title!: string;
  loading = false;
  submitting = false;
  submitted = false;
  id?: number;
  companies: any = [];
  roles: any = [];

  EditData!: User;

  hide = true;
  Confirmhide = true;

  subscription$: any;

  currentUser = localStorage.getItem("Role");
  IsAdminUser = (this.currentUser === Roles.Admin)

  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private userService: UserService,
    private snackbar: SnackbarService) { }

  ngOnInit(): void {

    this.id = this.route.snapshot.params['id'];
    this.fetchCompanies();
    this.fetchRoles();

    this.AddEditUserForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern(Patterns.Email)]],
      contactNo: ['', [Validators.required, Validators.pattern(Patterns.ContactNo)]],
      password: ['', [Validators.pattern(Patterns.Password), ...(!this.id ? [Validators.required] : [])]],
      confirmPass: ['', [...(!this.id ? [Validators.required] : []), PasswordValidators.MatchValidator]],
      companyId: ['', [...(this.IsAdminUser ? [Validators.required] : [])]],
      roleId: ['', [...(this.IsAdminUser ? [Validators.required] : [])]],
      status: ['', [...(this.IsAdminUser ? [Validators.required] : [])]],
      userType: ['', [...(this.IsAdminUser ? [Validators.required] : [])]]
    });

    // to display title and get all te details of user if edit it called
    this.title = 'Add New Users';
    if (this.id) {
      // edit mode
      this.title = 'Edit Existing User';
      this.loading = true;
      this.userService.getById(this.id)
        .pipe(first())
        .subscribe(x => {
          this.AddEditUserForm.patchValue(x);
          this.loading = false;
        });
    }
  }

  // to show the company list in dropdown
  fetchCompanies() {
    this.subscription$ = this.userService.getCompanyList().subscribe(
      (response) => {
        this.companies = response;
      });
  }

  // to show the list of roles in dropdown
  fetchRoles() {
    this.subscription$ = this.userService.getRolesList().subscribe(
      (response) => {
        this.roles = response;
      });
  }

  OnSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.AddEditUserForm.invalid) {
      return;
    }

    this.submitting = true;

    // create or update user based on id param
    if (this.id) {
      //edit form
      this.EditData = this.AddEditUserForm.value;
      console.log(this.EditData)
      this.subscription$ = this.userService.update(this.id, this.EditData)
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
      //add form
      const formValue = this.AddEditUserForm.value;
      if (!this.IsAdminUser) {
        formValue.companyId = localStorage.getItem("CompanyId"); // Add same company Id as of the current user
        formValue.userType = Roles.User; //  add new role as user if an user is adding new employee of same company 
      }
      this.subscription$ = this.userService.add(formValue)
        .pipe(first())
        .subscribe({
          next: response => {
            let message = JSON.parse(JSON.stringify(response)).message;
            this.snackbar.showSnackbar(`${message}`, SnackbarType.Success);
          },
          error: error => {
            this.snackbar.showSnackbar(`${error}`, SnackbarType.Danger);
          }
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
