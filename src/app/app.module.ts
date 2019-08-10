import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule }    from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
// used to create fake backend
//import { fakeBackendProvider } from './_helpers';


import { AppComponent }  from './app.component';
import { routing }        from './app.routing';
import {BaseModule} from './base/base.module';
import{ SharedModule } from './shared.module';
import { WINDOW_PROVIDERS } from "./_services/window.service";
import { TaxfillingModule } from './taxfilling/taxfilling.module';

import { JwtInterceptor, ErrorInterceptor } from './_helpers';
import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { RegisterComponent } from './register';
import { ForgotpasswordComponent } from './forgotpassword';
import { ResetpasswordComponent } from './resetpassword';

import { DashboardComponent } from './dashboard';
import { PricingComponent } from './pricing';
import { ContactusComponent } from './contactus/contactus.component';
import { BuynowComponent } from './buynow/buynow.component';
import { UseractivationComponent } from './useractivation';
import { UserverificationComponent } from './userverification';
import { FaqComponent } from './faq/faq.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { TermscondnComponent } from './termscondn/termscondn.component';



@NgModule({
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        FormsModule,
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
        ContactusComponent,
        BuynowComponent,
        UseractivationComponent,
        UserverificationComponent,
        FaqComponent,
        PrivacyComponent,
        TermscondnComponent
    ],
        
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        WINDOW_PROVIDERS 
        // provider used to create fake backend
        //fakeBackendProvider,
    ],
    bootstrap: [AppComponent]
})

export class AppModule { }