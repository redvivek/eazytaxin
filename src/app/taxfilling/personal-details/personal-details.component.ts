import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl , Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Basicinfostep1, Personaldetails, Addressdetails, Bankdetails, Immovableassetsdetails, Assetsliabilitiesdetails } from '@app/_models';

@Component({
  selector: 'app-personal-details',
  templateUrl: './personal-details.component.html',
  styleUrls: ['./personal-details.component.css']
})
export class PersonalDetailsComponent implements OnInit {
  personalDetailsForm: FormGroup;
  loading = false;
  submitted = false;
  // step1:boolean = false;
  step2:boolean = true;
  step3:boolean = false;
  step4:boolean = false;
  step5:boolean = false;
  step4_primary_bank_acc:boolean = true;
  step4_all_other_bank_acc:boolean = false;
  step5_immovable:boolean = true;
  step5_movable:boolean = false;
  step5_foreign:boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router
    ) { }

  ngOnInit() {
    this.personalDetailsForm = this.formBuilder.group({
      Firstname: ['', Validators.required ],
      Lastname: ['', Validators.required ],
      Middlename:[''],
      EmailId: ['', [
                Validators.required,
                Validators.pattern("^([a-zA-Z0-9_.-]+)@([a-zA-Z0-9_.-]+)\\.([a-zA-Z]{2,5})$")
               ], ],
      Fathername: ['', Validators.required ],
      MobileNo: ['', Validators.required ],
      AltMobileNo:[''],
      landlineNo:[''],
      DateOfBirth: ['', Validators.required ],
      Gender: ['', Validators.required ],
      EmployerName: ['', Validators.required ],
      EmployerType: ['', Validators.required ],
      PanNumber: ['', Validators.required ],
      AadharNumber:[''],
      PassportNumber:[''],
      Flatno_Blockno: ['', Validators.required ],
      Building_Village_Premises:[''],
      Road_Street_PO:[''],
      Area_Locality:[''],
      Pincode: ['', Validators.required ],
      City_Town_District: ['', Validators.required ],
      State: ['', Validators.required ],
      Country: ['', Validators.required ],
      AccountNumber: ['', Validators.required ],
      AccountType:[''],
      BankName: ['', Validators.required ],
      IFSCCode: ['', Validators.required ],
      immovable_assets:[''],
      Description: ['', Validators.required ],
      FlatNo: ['', Validators.required ],
      PremiseName: ['', Validators.required ],
      StreetName: ['', Validators.required ],
      AreaLocality: ['', Validators.required ],
      immovable_State: ['', Validators.required ],
      country:[''],
      cost_purchase_price:[''],
      liabilities_in_relation_immovable_assets:[''],
      MovJwellaryItemsAmount:[''],
      MovCraftItemsAmount:[''],
      MovConveninceItemsAmount:[''],
      MovFABankAmount:[''],
      MovFASharesAmount:[''],
      MovFAInsAmount:[''],
      MovFALoansGivenAmount:[''],
      MovInHandCashAmount:[''],
      TotalLiability:[''],
      inputGroupFile01:[''] 
    });
  }
  get f() { return this.personalDetailsForm.controls; }

  onSubmit() {
      this.submitted = true;

      // stop here if form is invalid
      if (this.personalDetailsForm.invalid) {
          return;
      }

      this.loading = true;
      console.log('SUCCESS!! :-)\n\n' + JSON.stringify(this.personalDetailsForm.value))
      // this.userService.register(this.personal_details.value)
      //     .pipe(first())
      //     .subscribe(
      //         data => {
      //             this.alertService.success('Registration successful', true);
      //             this.router.navigate(['/login']);
      //         },
      //         error => {
      //             this.alertService.error(error);
      //             this.loading = false;
      //         });
  }
  on_next_click(){
    if (this.step5 == true) {
      // this.step1 = false;
      this.step2 = false;
      this.step3 = false;
      this.step4 = false;
      this.step5 = true;
    }
    if (this.step4 == true) {
      // this.step1 = false;
      this.step2 = false;
      this.step3 = false;
      this.step4 = false;
      this.step5 = true;
    }
    if (this.step3 == true) {
      // this.step1 = false;
      this.step2 = false;
      this.step3 = false;
      this.step4 = true;
      this.step5 = false;
    }
    if (this.step2 == true) {
      // this.step1 = false;
      this.step2 = false;
      this.step3 = true;
      this.step4 = false;
      this.step5 = false;
    }
    // if (this.step1 == true) {
    //   this.step1 = false;
    //   this.step2 = true;
    //   this.step3 = false;
    //   this.step4 = false;
    //   this.step5 = false;
    // }
  }
  on_previous_click(){
    // if (this.step1 == true) {
    //   this.step1 = true;
    //   this.step2 = false;
    //   this.step3 = false;
    //   this.step4 = false;
    //   this.step5 = false;
    // }
    if (this.step2 == true) {
      // this.step1 = true;
      this.step2 = true;
      this.step3 = false;
      this.step4 = false;
      this.step5 = false;
    }
    if (this.step3 == true) {
      // this.step1 = false;
      this.step2 = true;
      this.step3 = false;
      this.step4 = false;
      this.step5 = false;
    }
    if (this.step4 == true) {
      // this.step1 = false;
      this.step2 = false;
      this.step3 = true;
      this.step4 = false;
      this.step5 = false;
    }
    if (this.step5 == true) {
      // this.step1 = false;
      this.step2 = false;
      this.step3 = false;
      this.step4 = true;
      this.step5 = false;
    }
  }
  /*on_skip_click(){
    if (this.step5 == true) {
      this.step1 = false;
      this.step2 = false;
      this.step3 = false;
      this.step4 = false;
      this.step5 = true;
    }
    if (this.step4 == true) {
      this.step1 = false;
      this.step2 = false;
      this.step3 = false;
      this.step4 = false;
      this.step5 = true;
    }
    if (this.step3 == true) {
      this.step1 = false;
      this.step2 = false;
      this.step3 = false;
      this.step4 = true;
      this.step5 = false;
    }
    if (this.step2 == true) {
      this.step1 = false;
      this.step2 = false;
      this.step3 = true;
      this.step4 = false;
      this.step5 = false;
    }
    if (this.step1 == true) {
      this.step1 = false;
      this.step2 = true;
      this.step3 = false;
      this.step4 = false;
      this.step5 = false;
    }
  }*/
  on_reset_click(){
    // if (this.step1 == true) {
    // }
    // if (this.step2 == true) {
    // }
    // if (this.step3 == true) {
    // }
    // if (this.step4 == true) {
    // }
    // if (this.step5 == true) {
    // }
  }
  select_form_step(a){
    // if(a == 'step1'){
    //   this.step1 = true;
    //   this.step2 = false;
    //   this.step3 = false;
    //   this.step4 = false;
    //   this.step5 = false;
    // }
    if(a == 'step2'){
      // this.step1 = false;
      this.step2 = true;
      this.step3 = false;
      this.step4 = false;
      this.step5 = false;
    }
    if(a == 'step3'){
      // this.step1 = false;
      this.step2 = false;
      this.step3 = true;
      this.step4 = false;
      this.step5 = false;
    }
    if(a == 'step4'){
      // this.step1 = false;
      this.step2 = false;
      this.step3 = false;
      this.step4 = true;
      this.step5 = false;
    }
    if(a == 'step5'){
      // this.step1 = false;
      this.step2 = false;
      this.step3 = false;
      this.step4 = false;
      this.step5 = true;
    }
  }
  select_step5_subform_part(x){
    if( x == 'immovable') {
      this.step5_immovable = true;
      this.step5_movable = false;
      this.step5_foreign = false;
    }
    if( x == 'movable') {
      this.step5_immovable = false;
      this.step5_movable = true;
      this.step5_foreign = false;
    }
    if( x == 'foreign') {
      this.step5_immovable = false;
      this.step5_movable = false;
      this.step5_foreign = true;
    }
  }
  select_step4_subpart_form(z){
    if( z == 'Primary_Bank_Account') {
      this.step4_primary_bank_acc = true;
      this.step4_all_other_bank_acc = false;
    }
    if( z == 'All_Other_Bank_Account') {
      this.step4_primary_bank_acc = false;
      this.step4_all_other_bank_acc = true;
    }
  }
}
