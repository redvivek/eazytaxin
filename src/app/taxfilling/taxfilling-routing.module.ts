import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TaxPeriodComponent } from './tax-period';
import { BasicInformationComponent } from './basic-information';
import { PersonalDetailsComponent } from './personal-details';
import { IncomeSourceComponent } from './income-source';
import { DeductionsComponent } from './deductions';
import { TaxesPaidComponent } from './taxes-paid';
import {ReviewdetailsComponent} from './reviewdetails';
import {PaymentsComponent} from './payments';

const routes: Routes = [
	{	path: 'taxfilling/taxperiod', component: TaxPeriodComponent},
	{	path: 'taxfilling/basicinfo', component: BasicInformationComponent},
	{	path: 'taxfilling/personalinfo', component: PersonalDetailsComponent},
	{	path: 'taxfilling/earnings', component: IncomeSourceComponent},
	{	path: 'taxfilling/deductions', component: DeductionsComponent},
	{	path: 'taxfilling/taxpaid', component: TaxesPaidComponent},
	{	path: 'taxfilling/review', component: ReviewdetailsComponent},
	{	path: 'taxfilling/payment', component: PaymentsComponent},

	// otherwise redirect to taxperiod
    { path: 'taxfilling', redirectTo: 'taxfilling/taxperiod' }
 ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class TaxfillingRoutingModule { }
