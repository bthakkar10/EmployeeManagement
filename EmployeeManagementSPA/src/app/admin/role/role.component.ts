import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { first } from 'rxjs';
import { ColumnsName } from 'src/app/_Helpers';
import { RolePermission } from 'src/app/_Models/RolePermission';
import { SnackbarType } from 'src/app/_Models/Snackbar';
import { RoleService } from 'src/app/_Services/role.service';
import { ConfirmationDialogComponent } from 'src/app/_Shared/confirmation-dialog/confirmation-dialog.component';
import { SnackbarService } from 'src/app/_Shared/snackbar.service';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css']
})
export class RoleComponent implements OnInit {
  title = "Role Permissions";
  roles: any = [];
  rolePermission: any = [];

  dataSource: any;
  displayedColumns = ColumnsName.RolePermissionTableColumns;
  element!: RolePermission;

  subscription$: any;

  constructor(private roleService: RoleService,
    private snackbar: SnackbarService,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<any>();
    this.fetchRoles();
    this.fetchRolePermissions();
  }

  fetchRoles() {
    this.subscription$ = this.roleService.getRolesList().subscribe(
      (response) => {
        this.roles = response;
        this.mergeResponses();
      }
    );
  }

  fetchRolePermissions() {
    this.subscription$ = this.roleService.getAll().subscribe(
      (response) => {
        this.rolePermission = response;
        this.mergeResponses();
      }
    );
  }

  mergeResponses() {
    if (this.roles && this.rolePermission) {
      // Perform the merge based on the common RoleID
      this.element = this.roles.map((role: any) => {
        const matchedPermission = this.rolePermission.find((permission: any) => role.roleId === permission.roleId);
        return {
          roleId: role.roleId,
          roleName: role.roleName,
          canView: matchedPermission ? matchedPermission.canView : false,
          canAdd: matchedPermission ? matchedPermission.canAdd : false,
          canEdit: matchedPermission ? matchedPermission.canEdit : false,
          canDelete: matchedPermission ? matchedPermission.canDelete : false,
        };
      });
      this.dataSource = this.element;// Assign this.element to the dataSource property so that it is displayed in component
    }
  }

  SavePermission(element: RolePermission) {
    this.subscription$ = this.roleService.update(element.roleId, element)
      .pipe(first())
      .subscribe({
        next: response => {
          let message = JSON.parse(JSON.stringify(response)).message;
          this.snackbar.showSnackbar(`${message}`, SnackbarType.Success);
        },
        error: error => {
          this.snackbar.showSnackbar(`${error}`, SnackbarType.Danger);
        },
      }
      );
  }

  AddDialogBox() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Add Role',
        ConfirmText: 'Add',
        InputValue: '',
      }
    });

    this.subscription$ = dialogRef.componentInstance.confirmed.subscribe(() => {
      const roleName = dialogRef.componentInstance.data.InputValue;
      this.AddRole(roleName);
    });
  }

  AddRole(RoleName: any) {
    console.log(RoleName)
    this.subscription$ = this.roleService.AddRoles(RoleName)
      .pipe(first())
      .subscribe({
        next: response => {
          let message = JSON.parse(JSON.stringify(response)).message;
          this.snackbar.showSnackbar(`${message}`, SnackbarType.Success);
          // Retrieve the updated list of role permissions
          this.fetchRoles();
          this.fetchRolePermissions();

        },
        error: error => {
          this.snackbar.showSnackbar(`${error}`, SnackbarType.Danger);
        }
      }
      );
  }

  ngOnDestroy() {
    if (this.subscription$) {
      this.subscription$.unsubscribe();
    }
  }

}
