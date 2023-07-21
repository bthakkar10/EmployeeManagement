import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Company } from 'src/app/_Models/company';
import { SnackbarType } from 'src/app/_Models/Snackbar';
import { CompanyService } from 'src/app/_Services/company.service';
import { SnackbarService } from 'src/app/_Shared/snackbar.service';
import { ColumnsName } from '../../_Helpers';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/_Shared/confirmation-dialog/confirmation-dialog.component';


@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})

export class CompanyComponent implements OnInit, AfterViewInit {
  element: any
  dataSource: any;
  title = "Companies";
  displayedColumns = ColumnsName.CompanyTableColumns;

  subscription$: any;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private companyService: CompanyService,
    private snackbar: SnackbarService,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<Company>();
    this.getAllCompanies();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  getAllCompanies() {
    this.subscription$ = this.companyService.getAll().subscribe(
      (response) => {
        this.element = response;
        this.dataSource.data = this.element; // Assign the response to dataSource
        this.dataSource.sort = this.sort; //for sorting
        this.dataSource.paginator = this.paginator; //for pagination
      },
      (error) => {
        console.error('Error fetching companies:', error);
      });
  }

  doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  openDeleteConfirmationDialog(companyId: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Delete',
        message: 'Are you sure you want to delete this company?',
        ConfirmText: 'Confirm'
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // User confirmed, perform the delete operation
        this.deleteCompany(companyId);
      }
    });
  }


  deleteCompany(id: number) {
    this.subscription$ = this.companyService.delete(id).subscribe(
      response => {
        let message = JSON.parse(JSON.stringify(response)).message;
        this.snackbar.showSnackbar(`${message}`, SnackbarType.Success);
        this.dataSource.data = this.dataSource.data.filter((company: Company) => company.companyId !== id);
      },
    );
  }

  ngOnDestroy() {
    if (this.subscription$) {
      this.subscription$.unsubscribe();
    }
  }

}
