import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@app/_guards';
import { TaxPeriodComponent } from './tax-period';
import { BasicInformationComponent } from './basic-information';
import { PersonalDetailsComponent } from './personal-details';
import { IncomeSourceComponent } from './income-source';
import { DeductionsComponent } from './deductions';
import { TaxesPaidComponent } from './taxes-paid';
import {ReviewdetailsComponent} from './reviewdetails';
import {PaymentsComponent} from './payments';


const routes: Routes = [
	{	path: 'taxfilling/taxperiod', component: TaxPeriodComponent,canActivate: [ AuthGuard ]},
	{	path: 'taxfilling/basicinfo', component: BasicInformationComponent,canActivate: [ AuthGuard ]},
	{	path: 'taxfilling/personalinfo', component: PersonalDetailsComponent,canActivate: [ AuthGuard ]},
	{	path: 'taxfilling/earnings', component: IncomeSourceComponent,canActivate: [ AuthGuard ]},
	{	path: 'taxfilling/deductions', component: DeductionsComponent,canActivate: [ AuthGuard ]},
	{	path: 'taxfilling/taxpaid', component: TaxesPaidComponent,canActivate: [ AuthGuard ]},
	{	path: 'taxfilling/review', component: ReviewdetailsComponent,canActivate: [ AuthGuard ]},
	{	path: 'taxfilling/payment', component: PaymentsComponent,canActivate: [ AuthGuard ]},

	// otherwise redirect to taxperiod
    { path: 'taxfilling', redirectTo: 'taxfilling/taxperiod' ,canActivate: [ AuthGuard ] }
 ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class TaxfillingRoutingModule { }
