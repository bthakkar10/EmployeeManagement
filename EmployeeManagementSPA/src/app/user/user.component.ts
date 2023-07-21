import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { first } from 'rxjs';
import { Company, Roles, User } from 'src/app/_Models';
import { UserService } from 'src/app/_Services/user.service';
import { SnackbarService } from 'src/app/_Shared/snackbar.service';
import { ColumnsName } from '../_Helpers';
import { SnackbarType } from '../_Models/Snackbar';
import { ConfirmationDialogComponent } from '../_Shared/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})

export class UserComponent implements OnInit, AfterViewInit {
  element: any = [];
  CompanyId: any;
  dataSource: any;
  title = "Users";
  displayedColumns = ColumnsName.UserTableColumns;
  subscription$: any;

  currentRolePermission: any;

  IsAdminUser = (localStorage.getItem("Role") === Roles.Admin)

  companies: any = [];
  companyNamesMap: Map<number, string> = new Map<number, string>();
  selectedCompany?: any;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private userService: UserService,
    private snackbar: SnackbarService,
    private dialog: MatDialog) {
    this.CompanyId = localStorage.getItem("CompanyId");
  }

  ngOnInit(): void {
    this.selectedCompany = '';
    this.dataSource = new MatTableDataSource<User>();
    this.getAllUsers();
    if (!this.IsAdminUser) {
      this.getUserPermission();
    }
    this.fetchCompanies();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  //fetching list of users
  getAllUsers() {
    if (this.IsAdminUser) {
      //if user is admin, all the users are shown
      this.subscription$ = this.userService.getAll().subscribe(
        (response) => {
          this.element = response;
          this.dataSource.data = this.element; // Assign the response to dataSource
          this.dataSource.sort = this.sort; //for sorting
          this.dataSource.paginator = this.paginator; //for pagination
        },
      );
    }
    else {
      //if user is normal user, then only users of same company are displayed 
      this.subscription$ = this.userService.getUserBasedOnCompany(this.CompanyId).subscribe(
        (response) => {
          this.element = response;
          this.dataSource.data = this.element; // Assign the response to dataSource
          this.dataSource.sort = this.sort; //for sorting
          this.dataSource.paginator = this.paginator; //for pagination
        },
      );
    }
  }

  //search
  doSearch = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  // doFilter() {
  //   console.log("in")
  //   // Custom filtering function
  //   const customFilterPredicate = (data: any, filter: string) => {
  //     // If no company is selected, show all rows
  //     if (!filter) {
  //       return true;
  //     }
  //     // Perform the filtering based on the selected company
  //     return data.companyName === filter;
  //   };

  //   // Assign the custom filtering function to the filterPredicate property of the data source
  //   this.dataSource.filterPredicate = customFilterPredicate;

  //   // Apply the filter
  //   this.dataSource.filter = this.selectedCompany;
  // }


  //Select input onchange function
  // onChange(getName: any) {
  //   /* configure filter */
  //   console.log("hi")
  //   this.dataSource.filter = getName.trim().toLowerCase();
  //   console.log(this.dataSource.filter)
  // }




  // to open confirmation dialog box for delete 
  openDeleteConfirmationDialog(userId: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Delete User',
        message: 'Are you sure you want to delete this user?',
        ConfirmText: 'Confirm',
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // User confirmed, perform the delete operation
        this.deleteUser(userId);
      }
    });
  }

  // to delete any user 
  deleteUser(id: number) {
    this.userService.delete(id).subscribe(
      response => {
        let message = JSON.parse(JSON.stringify(response)).message;
        this.snackbar.showSnackbar(`${message}`, SnackbarType.Success);
        this.dataSource.data = this.dataSource.data.filter((user: User) => user.userId !== id);
      },
    );
  }

  //to fetch the users permission according to the roles assigned to them
  getUserPermission() {
    const RoleId = localStorage.getItem("RoleId");
    this.userService.getPermissionById(RoleId)
      .pipe(first())
      .subscribe(x => {
        this.currentRolePermission = x;
      });
  }

  // fetch company list to display company in table 
  fetchCompanies() {
    this.subscription$ = this.userService.getCompanyList().subscribe(
      (response) => {
        this.companies = response;
        this.companies.forEach((company: Company) => {
          this.companyNamesMap.set(company.companyId, company.companyName);
        });
      });
  }

  ngOnDestroy() {
    if (this.subscription$) {
      this.subscription$.unsubscribe();
    }
  }
}
