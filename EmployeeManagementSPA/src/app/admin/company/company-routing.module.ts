import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddEditCompanyComponent } from './add-edit-company/add-edit-company.component';
import { CompanyComponent } from './company.component';



const routes: Routes = [{ path: 'company', component: CompanyComponent },
{ path: 'AddCompany', component: AddEditCompanyComponent },
{ path: 'EditCompany/:id', component: AddEditCompanyComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyRoutingModule { }
