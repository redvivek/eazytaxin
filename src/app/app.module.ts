import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule }    from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// used to create fake backend
//import { fakeBackendProvider } from './_helpers';


import { AppComponent }  from './app.component';
import { routing }        from './app.routing';

import {BaseModule} from './base/base.module';
import{ SharedModule } from './shared.module';
import { TaxfillingModule } from './taxfilling/taxfilling.module';

import { JwtInterceptor, ErrorInterceptor } from './_helpers';
import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { RegisterComponent } from './register';
import { ForgotpasswordComponent } from './forgotpassword';
import { ResetpasswordComponent } from './resetpassword';

import { DashboardComponent } from './dashboard';
import { PricingComponent } from './pricing';

@NgModule({
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        HttpClientModule,
        BaseModule,
        routing,
        TaxfillingModule,
        SharedModule
    ],
    declarations: [
        AppComponent,
        HomeComponent,
        LoginComponent,
        RegisterComponent,
        ForgotpasswordComponent ,
        ResetpasswordComponent,
        DashboardComponent,
        PricingComponent,
    ],
        
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

        // provider used to create fake backend
        //fakeBackendProvider
    ],
    bootstrap: [AppComponent]
})

export class AppModule { }