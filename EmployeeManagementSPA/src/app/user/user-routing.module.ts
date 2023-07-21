import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddEditUserComponent } from './add-edit-user/add-edit-user.component';
import { UserComponent } from './user.component';

const routes: Routes = [{ path: '', component: UserComponent },
{ path: 'AddUser', component: AddEditUserComponent },
{ path: 'EditUser/:id', component: AddEditUserComponent },
{ path: '**', component: UserComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
