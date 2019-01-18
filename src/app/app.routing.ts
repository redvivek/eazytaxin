import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { RegisterComponent } from './register';
import { AuthGuard } from './_guards';
import {ForgotpasswordComponent} from './forgotpassword';
import {ResetpasswordComponent} from './resetpassword';

const appRoutes: Routes = [
    { path: '', component: LoginComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'forgotpassword', component: ForgotpasswordComponent },
    { path: 'resetpassword', component: ResetpasswordComponent },
    { path: 'taxfilling', loadChildren: './taxfilling/taxfilling.module#TaxfillingModule'},

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);