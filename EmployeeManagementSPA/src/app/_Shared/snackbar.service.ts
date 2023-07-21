import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarHorizontalPosition, MatSnackBarRef, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  snackBarConfig?: MatSnackBarConfig;
  snackBarRef?: MatSnackBarRef<any>;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  snackBarAutoHide = '1500';

  constructor(private _snackBar: MatSnackBar) { }

  showSnackbar(message: string, type: string): void {
    const config = new MatSnackBarConfig();
    config.verticalPosition = 'top';
    config.horizontalPosition = 'center';
    config.panelClass = `snackbar-${type}`;
    config.duration = 5000; // Snackbar duration in milliseconds
    this._snackBar.open(message, 'Close', config);
  }
}
