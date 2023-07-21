import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../_Helpers';

const CompanyModule = () => import('./company/company.module').then(m => m.CompanyModule);
const RoleModule = () => import('./role/role.module').then(m => m.RoleModule);

const routes: Routes = [
  { path: '', loadChildren: CompanyModule, canActivate: [AuthGuard] },
  { path: '', loadChildren: RoleModule, canActivate: [AuthGuard] }

];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
