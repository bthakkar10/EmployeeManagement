import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './_Components/home/home.component';
import { AuthGuard } from './_Helpers/auth.guard';

const AccountModule = () => import('./account/account.module').then(x => x.AccountModule);
const AdminModule = () => import('./admin/admin.module').then(x => x.AdminModule);
const UserModule = () => import('./user/user.module').then(m => m.UserModule);

const routes: Routes = [
  { path: '', loadChildren: AccountModule },
  { path: 'admin', loadChildren: AdminModule, canActivate: [AuthGuard] },
  { path: 'user', loadChildren: UserModule },
  { path: 'home', component: HomeComponent },
  { path: '**', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
