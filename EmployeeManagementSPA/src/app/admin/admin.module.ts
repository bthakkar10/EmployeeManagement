import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';

import { AdminRoutingModule } from './admin-routing.module';
import { CompanyModule } from './company/company.module';
import { RoleModule } from './role/role.module';

@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    AdminRoutingModule,


    CompanyModule,
    RoleModule
  ],

})
export class AdminModule { }
