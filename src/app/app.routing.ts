import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { RegisterComponent } from './register';
import { AuthGuard } from './_guards';
import {ForgotpasswordComponent} from './forgotpassword';
import {ResetpasswordComponent} from './resetpassword';

const appRoutes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'forgotpassword', component: ForgotpasswordComponent },
    { path: 'resetpassword', component: ResetpasswordComponent },
    {
        path: '',
        canActivate: [ AuthGuard ],
        children: [
          {
             path: 'taxfilling',
             loadChildren: './taxfilling/taxfilling.module#TaxfillingModule'
          },
          {
             path: 'dashboard',
             component: HomeComponent
          }
        ]		
     },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);