import { Component, OnInit } from '@angular/core';

import { ScriptService } from '@app/_services';

@Component({
  selector: 'app-income-source',
  templateUrl: './income-source.component.html',
  styleUrls: ['./income-source.component.css']
})
export class IncomeSourceComponent implements OnInit {
  step1:boolean = true;
  step2:boolean = false;
  step3:boolean = false;
  step4:boolean = false;
  step5:boolean = false;

  step1_income_salary_upload :boolean = true;
  step1_income_from_salary:boolean = false;
  
  step2_income_other_upload :boolean = true;
  step2_income_other_data:boolean = false;

  step3_house_prop_upload :boolean = true;
  step3_prop_address:boolean = false;
  step3_rental_prop:boolean = false;
  step3_interest_house_loan:boolean = false;
  step3_prop_ownership:boolean = false;
  step3_income_dependent:boolean = false;
  step3_unrealized_rent:boolean = false;

  step4_house_prop_upload :boolean = true;
  step4_prop_address:boolean = false;
  step4_rental_prop:boolean = false;
  step4_interest_house_loan:boolean = false;
  step4_prop_ownership:boolean = false;
  step4_income_dependent:boolean = false;
  step4_unrealized_rent:boolean = false;


  constructor( 
    private scriptservice : ScriptService
  ) {
    this.scriptservice.load('mainJS').then(data => {
      console.log('script loaded ', data);
    }).catch(error => console.log(error));
  }

  ngOnInit() {
  }

  //Function Called on next button click
  on_next_click(){
    //this.loading = true;
    if (this.step5 == true) {
      /*this.assSubmitted = true;
      console.log("Assests details submitted");
      if (this.assestsDetailsForm.invalid) {
        return;
      }else{
        this.onSubmit(this.assestsDetailsForm,'asstinfo');*/
        this.step1 = false;
        this.step2 = false;
        this.step3 = false;
        this.step4 = false;
        this.step5 = true
      //}
      
    }
    if (this.step4 == true) {
      /*this.assSubmitted = true;
      console.log("Assests details submitted");
      if (this.assestsDetailsForm.invalid) {
        return;
      }else{
        this.onSubmit(this.assestsDetailsForm,'asstinfo');*/
        this.step1 = false;
        this.step2 = false;
        this.step3 = false;
        this.step4 = false;
        this.step5 = true;
      //}
      
    }
    if (this.step3 == true) {
      /*this.bankSubmitted = true;
      console.log("Bank details submitted");
      if (this.bankDetailsForm.invalid) {
        return;
      }else{
        this.onSubmit(this.bankDetailsForm,'bankinfo');*/
        this.step1 = false;
        this.step2 = false;
        this.step3 = false;
        this.step4 = true;
        this.step5 = false;
      //}
      
    }
    if (this.step2 == true) {
      /*this.addSubmitted = true;
      console.log("Address details submitted");
      if (this.addressDetailsForm.invalid) {
        return;
      }else{
        this.onSubmit(this.addressDetailsForm,'addressinfo');*/
        this.step1 = false;
        this.step2 = false;
        this.step3 = true;
        this.step4 = false;
        this.step5 = false;
      //}
      
    }
    if (this.step1 == true) {
      //this.perSubmitted = true;
      console.log("Personal details submitted");
      // stop here if form is invalid
      /*if (this.personalDetailsForm.invalid) {
        return;
      }else{
        this.onSubmit(this.personalDetailsForm,'personalinfo');*/
        this.step1 = false;
        this.step2 = true;
        this.step3 = false;
        this.step4 = false;
        this.step5 = false;
      //}
    }
  }

  //Function Called on previous button click
  on_previous_click(){
    if (this.step1 == true) {
      this.step1 = true;
      this.step2 = false;
      this.step3 = false;
      this.step4 = false;
      this.step5 = false;
    }
    if (this.step2 == true) {
      this.step1 = true;
      this.step2 = false;
      this.step3 = false;
      this.step4 = false;
      this.step5 = false;
    }
    if (this.step3 == true) {
      this.step1 = false;
      this.step2 = true;
      this.step3 = false;
      this.step4 = false;
      this.step5 = false;
    }
    if (this.step4 == true) {
      this.step1 = false;
      this.step2 = false;
      this.step3 = true;
      this.step4 = false;
      this.step5 = false;
    }
    if (this.step5 == true) {
      this.step1 = false;
      this.step2 = false;
      this.step3 = false;
      this.step4 = true;
      this.step5 = false;
    }
  }

  //Function to enable forms from naviagtion icons
  select_form_step(a){
    if(a == 'step1'){
      this.step1 = true;
      this.step2 = false;
      this.step3 = false;
      this.step4 = false;
      this.step5 = false;
    }
    if(a == 'step2'){
      this.step1 = false;
      this.step2 = true;
      this.step3 = false;
      this.step4 = false;
      this.step5 = false;
    }
    if(a == 'step3'){
      this.step1 = false;
      this.step2 = false;
      this.step3 = true;
      this.step4 = false;
      this.step5 = false;
    }
    if(a == 'step4'){
      this.step1 = false;
      this.step2 = false;
      this.step3 = false;
      this.step4 = true;
      this.step5 = false;
    }
    if(a == 'step5'){
      this.step1 = false;
      this.step2 = false;
      this.step3 = false;
      this.step4 = false;
      this.step5 = true;
    }
  }

  select_step1_subpart_form(x){
    if(x == 'income_salary_upload'){
      this.step1_income_salary_upload = true;
      this.step1_income_from_salary = false;
    }
    if(x == 'income_from_salary'){
      this.step1_income_salary_upload = false;
      this.step1_income_from_salary = true;
    }
  }
  select_step2_subpart_form(x){
    if(x == 'income_other_upload'){
      this.step2_income_other_upload = true;
      this.step2_income_other_data = false;
    }
    if(x == 'income_other_data'){
      this.step2_income_other_upload = false;
      this.step2_income_other_data = true;
    }
  }
  select_step3_subpart_form(x){
    if(x == 'house_prop_upload'){
      this.step3_house_prop_upload = true;
      this.step3_prop_address = false;
      this.step3_rental_prop = false;
      this.step3_interest_house_loan  = false;
      this.step3_prop_ownership = false;
      this.step3_unrealized_rent= false;
    }
    if(x == 'prop_address'){
      this.step3_house_prop_upload = false;
      this.step3_prop_address = true;
      this.step3_rental_prop = false;
      this.step3_interest_house_loan  = false;
      this.step3_prop_ownership = false;
      this.step3_unrealized_rent= false;
    }
    if(x == 'rental_prop'){
      this.step3_house_prop_upload = false;
      this.step3_prop_address = false;
      this.step3_rental_prop = true;
      this.step3_interest_house_loan  = false;
      this.step3_prop_ownership = false;
      this.step3_unrealized_rent= false;
    }
    if(x == 'interest_house_loan'){
      this.step3_house_prop_upload = false;
      this.step3_prop_address = false;
      this.step3_rental_prop = false;
      this.step3_interest_house_loan  = true;
      this.step3_prop_ownership = false;
      this.step3_unrealized_rent= false;
    }
    if(x == 'prop_ownership'){
      this.step3_house_prop_upload = false;
      this.step3_prop_address = false;
      this.step3_rental_prop = false;
      this.step3_interest_house_loan  = false;
      this.step3_prop_ownership = true;
      this.step3_unrealized_rent= false;
    }
    if(x == 'unrealized_rent'){
      this.step3_house_prop_upload = false;
      this.step3_prop_address = false;
      this.step3_rental_prop = false;
      this.step3_interest_house_loan  = false;
      this.step3_prop_ownership = false;
      this.step3_unrealized_rent= true;
    }
  }

  select_step4_subpart_form(x){
    if(x == 'house_prop_upload'){
      this.step4_house_prop_upload = true;
      this.step4_prop_address = false;
      this.step4_rental_prop = false;
      this.step4_interest_house_loan  = false;
      this.step4_prop_ownership = false;
      this.step4_unrealized_rent= false;
    }
    if(x == 'prop_address'){
      this.step4_house_prop_upload = false;
      this.step4_prop_address = true;
      this.step4_rental_prop = false;
      this.step4_interest_house_loan  = false;
      this.step4_prop_ownership = false;
      this.step4_unrealized_rent= false;
    }
    if(x == 'rental_prop'){
      this.step4_house_prop_upload = false;
      this.step4_prop_address = false;
      this.step4_rental_prop = true;
      this.step4_interest_house_loan  = false;
      this.step4_prop_ownership = false;
      this.step4_unrealized_rent= false;
    }
    if(x == 'interest_house_loan'){
      this.step4_house_prop_upload = false;
      this.step4_prop_address = false;
      this.step4_rental_prop = false;
      this.step4_interest_house_loan  = true;
      this.step4_prop_ownership = false;
      this.step4_unrealized_rent= false;
    }
    if(x == 'prop_ownership'){
      this.step4_house_prop_upload = false;
      this.step4_prop_address = false;
      this.step4_rental_prop = false;
      this.step4_interest_house_loan  = false;
      this.step4_prop_ownership = true;
      this.step4_unrealized_rent= false;
    }
    if(x == 'unrealized_rent'){
      this.step4_house_prop_upload = false;
      this.step4_prop_address = false;
      this.step4_rental_prop = false;
      this.step4_interest_house_loan  = false;
      this.step4_prop_ownership = false;
      this.step4_unrealized_rent= true;
    }
  }

}
