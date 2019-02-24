import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { RegisterComponent } from './register';
import { AuthGuard } from './_guards';
import {ForgotpasswordComponent} from './forgotpassword';
import {ResetpasswordComponent} from './resetpassword';
import { DashboardComponent } from './dashboard';
import { PricingComponent } from './pricing';
import { ContactusComponent } from './contactus';
import { BuynowComponent } from './buynow';

const appRoutes: Routes = [
   { path: '', component: HomeComponent },
   { path: 'home',component: HomeComponent }, 
   { path: 'plans',component: PricingComponent }, 
   { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'forgotpassword', component: ForgotpasswordComponent },
    { path: 'resetpassword', component: ResetpasswordComponent },
    { path: 'contactus', component: ContactusComponent },
    { path: 'buynow', component: BuynowComponent },
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
             component: DashboardComponent
          }
        ]		
    },
    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);