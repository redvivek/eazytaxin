import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadModule } from 'ng2-file-upload/ng2-file-upload';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import {TaxfillingRoutingModule} from './taxfilling-routing.module';
import { TaxPeriodComponent } from './tax-period';
import { BasicInformationComponent } from './basic-information';
import { PersonalDetailsComponent } from './personal-details';
import { IncomeSourceComponent } from './income-source';
import { DeductionsComponent } from './deductions';
import { TaxesPaidComponent } from './taxes-paid';
import { MainmenusComponent } from './mainmenus';
import { ReviewdetailsComponent } from './reviewdetails';
import { PaymentsComponent } from './payments';
import { TransactionComponent } from './transaction';
import{ SharedModule } from '../shared.module';


@NgModule({
  declarations: [
    MainmenusComponent,
    TaxPeriodComponent, 
    BasicInformationComponent, 
    PersonalDetailsComponent, 
    IncomeSourceComponent, 
    DeductionsComponent, 
    TaxesPaidComponent, 
    ReviewdetailsComponent, 
    PaymentsComponent,
    TransactionComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TaxfillingRoutingModule,
    SharedModule,
    FileUploadModule
  ]
})
export class TaxfillingModule { }
