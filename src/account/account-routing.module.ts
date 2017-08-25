import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';

import { ForgotPasswordComponent } from './password/forgot-password.component';
import { ResetPasswordComponent } from './password/reset-password.component';


@NgModule({
  imports: [
    RouterModule.forRoot([
      { path: 'login', component: LoginComponent },
      
      { path: 'forgot-password', component: ForgotPasswordComponent },
      { path: 'reset-password', component: ResetPasswordComponent },
     
      { path: '', redirectTo: '/login', pathMatch:'full' },
      { path: '**', redirectTo:'/login', pathMatch:'full' }
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class AccountRoutingModule {}