import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Basicinfostep1, Personaldetails, Addressdetails, Bankdetails, Immovableassetsdetails, Assetsliabilitiesdetails } from '@app/_models';
import { AuthenticationService,ApplicationService, AlertService } from '@app/_services';

@Component({
  selector: 'app-personal-details',
  templateUrl: './personal-details.component.html',
  styleUrls: ['./personal-details.component.css']
})
export class PersonalDetailsComponent implements OnInit {
  personalDetailsForm: FormGroup;
  addressDetailsForm: FormGroup;
  bankDetailsForm: FormGroup;
  assestsDetailsForm: FormGroup;
  loading = false;
  perSubmitted = false;
  addSubmitted = false;
  bankSubmitted = false;
  assSubmitted = false;
  submittedData = [];
  
  step2:boolean = true;
  step3:boolean = false;
  step4:boolean = false;
  step5:boolean = false;

  step4_primary_bank_acc:boolean = true;
  step4_all_other_bank_acc:boolean = false;

  step5_immovable:boolean = true;
  step5_movable:boolean = false;
  step5_foreign:boolean = false;

  userId : number;
  ApplicationId : number;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private appService : ApplicationService,
    private alertService : AlertService
  ) {
      // redirect to login if not logged in
      if (!this.authenticationService.currentUserValue) { 
        this.router.navigate(['/login']);
      }else{
        //console.log("Current user value "+ JSON.stringify(this.authenticationService.currentUserValue));
        //console.log("Current App value "+ this.appService.currentApplicationValue);
        this.userId         = this.authenticationService.currentUserValue.userid;
        this.ApplicationId  = this.appService.currentApplicationValue.appId;
        console.log("Current App Id "+ this.ApplicationId);
      }
  }

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
      MobileNo: ['', [
                Validators.required,
                Validators.pattern("^[0-9]*$"),
                Validators.maxLength(10) 
      ],],
      AltMobileNo:['',[
                Validators.pattern("^[0-9]*$"),
                Validators.maxLength(10)
      ],],
      //landlineNo:[''],
      DateOfBirth: ['', Validators.required ],
      Gender: ['', Validators.required ],
      EmployerName: ['', Validators.required ],
      EmployerType: ['', Validators.required ],
      PanNumber: ['', Validators.required ],
      AadharNumber:['',[
                Validators.required,
                Validators.pattern("^[0-9]*$"),
                Validators.maxLength(16) 
      ],],
      PassportNumber:['']
    });

    this.addressDetailsForm = this.formBuilder.group({
      Flatno_Blockno: ['', Validators.required ],
      Building_Village_Premises:['' ,Validators.required],
      Road_Street_PO:['', Validators.required],
      Area_Locality:['' ,Validators.required],
      Pincode: ['', Validators.required ],
      City_Town_District: ['', Validators.required ],
      State: ['', Validators.required ],
      Country: ['', Validators.required ]
    });

    this.bankDetailsForm = this.formBuilder.group({
      PrimaryAccNumber: ['', Validators.required ],
      PrimaryAccType:['',Validators.required],
      PrimaryBankNm: ['', Validators.required ],
      PrimaryIFSCCode: ['', Validators.required ],
      SecAccNumber: ['', Validators.required ],
      SecAccType:['',Validators.required],
      SecBankNm: ['', Validators.required ],
      SecIFSCCode: ['', Validators.required ]
    });

    this.assestsDetailsForm = this.formBuilder.group({
      immovable_assets:[''],
      Description: ['', Validators.required ],
      FlatNo: ['', Validators.required ],
      PremiseName: ['', Validators.required ],
      StreetName: ['', Validators.required ],
      AreaLocality: ['', Validators.required ],
      immovable_State: ['', Validators.required ],
      immovable_Pincode: ['', Validators.required ],
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

    this.autoFillPersonalInfoForm();
  }

  get f() { return this.personalDetailsForm.controls; }
  get a() { return this.addressDetailsForm.controls; }
  get b() { return this.bankDetailsForm.controls; }
  get s() { return this.assestsDetailsForm.controls; }

  onSubmit(formname,infoType) {
    var perInfoInputParam,addInfoInputParam,bankInfoInputParam,assetsInfoInputParam;  
    console.log('SUCCESS!! :-)\n\n' + JSON.stringify(formname.value))
      switch(infoType){
        case "personalinfo":
        perInfoInputParam = {
            'appId':this.ApplicationId,
            'userId':this.userId,
            "Firstname":this.f.Firstname.value,
            "Lastname":this.f.Lastname.value,
            "Middlename":this.f.Middlename.value,
            "EmailId":this.f.EmailId.value,
            "Fathername":this.f.Fathername.value,
            "MobileNo":this.f.MobileNo.value,
            "AltMobileNo":this.f.AltMobileNo.value,
            "DateOfBirth":this.f.DateOfBirth.value,
            "Gender":this.f.Gender.value,
            "EmployerName":this.f.EmployerName.value,
            "EmployerType":this.f.EmployerType.value,
            "PanNumber":this.f.PanNumber.value,
            "AadharNumber":this.f.AadharNumber.value,
            "PassportNumber":this.f.PassportNumber.value
          };
          this.submittedData.push({"addressInfoData":perInfoInputParam});
          // start storing application data in database
          this.appService.savePersonalInfoData(perInfoInputParam)
          .pipe(first())
          .subscribe(
            data => {
                    console.log("Response" + JSON.stringify(data));
                    //successfully inserted
                    if(data['statusCode'] == 200){                  
                        this.alertService.error('Application - Personal Info data saved successfully');
                    }
                },
            error => {
                this.alertService.error(error);
            });
        break;
        case "addressinfo":
        addInfoInputParam = {
          'appId':this.ApplicationId,
          'userId':this.userId,
          "Addresstype":"Residence",
          "Flatno":this.a.Flatno_Blockno.value,
          "Building":this.a.Building_Village_Premises.value,
          "Street":this.a.Road_Street_PO.value,
          "Area":this.a.Area_Locality.value,
          "Pincode":this.a.Pincode.value,
          "City":this.a.City_Town_District.value,
          "State":this.a.State.value,
          "Country":this.a.Country.value,
        };
        this.submittedData.push({"addressInfoData":addInfoInputParam});
        // start storing application data in database
        this.appService.saveAddressInfoData(addInfoInputParam)
        .pipe(first())
        .subscribe(
          data => {
                  console.log("Response" + JSON.stringify(data));
                  //successfully inserted
                  if(data['statusCode'] == 200){                  
                      this.alertService.error('Application - Address Info data saved successfully');
                  }
              },
          error => {
              this.alertService.error(error);
          });
        break;
        case "bankinfo":
        bankInfoInputParam = {
          'appId':this.ApplicationId,
          'userId':this.userId,
          'Details':[
            {
              "AccPriority":"Primary",
              "AccNumber":this.b.PrimaryAccNumber.value,
              "AccType":this.b.PrimaryAccType.value,
              "BankNm":this.b.PrimaryBankNm.value,
              "IFSCCode":this.b.PrimaryIFSCCode.value,
            },
            {
              "AccPriority":"Others",
              "AccNumber":this.b.SecAccNumber.value,
              "AccType":this.b.SecAccType.value,
              "BankNm":this.b.SecBankNm.value,
              "IFSCCode":this.b.SecIFSCCode.value,
            },
          ]
        };
        this.submittedData.push({"bankInfoData":bankInfoInputParam});
        // start storing application data in database
        this.appService.saveBankInfoData(bankInfoInputParam)
        .pipe(first())
        .subscribe(
          data => {
                  console.log("Response" + JSON.stringify(data));
                  //successfully inserted
                  if(data['statusCode'] == 200){                  
                      this.alertService.error('Application - Bank Info data saved successfully');
                  }
              },
          error => {
              this.alertService.error(error);
          });
        break;
        case "asstinfo":
        assetsInfoInputParam = {
          'appId':this.ApplicationId,
          'userId':this.userId,
          "immovableAssetsFlag":this.s.immovable_assets.value,
          "movJwellaryItemsAmount":this.s.MovJwellaryItemsAmount.value,
          "movCraftItemsAmount":this.s.MovCraftItemsAmount.value,
          "movConveninceItemsAmount":this.s.MovConveninceItemsAmount.value,
          "movFABankAmount":this.s.MovFABankAmount.value,
          "movFASharesAmount":this.s.MovFASharesAmount.value,
          "movFAInsAmount":this.s.MovFAInsAmount.value,
          "movFALoansGivenAmount":this.s.MovFALoansGivenAmount.value,
          "movInHandCashAmount":this.s.MovInHandCashAmount.value,
          "totalLiability":this.s.TotalLiability.value,
          "foreignAssFlag":0,
          "ImmovableAssDetails":[
            {
              "description":this.s.Description.value,
              "flatNo":this.s.FlatNo.value,
              "premiseName":this.s.PremiseName.value,
              "streetName":this.s.StreetName.value,
              "locality":this.s.AreaLocality.value,
              "state":this.s.immovable_State.value,
              "pincode":this.s.immovable_Pincode.value,
              "country":this.s.country.value,
              "purchaseCost":this.s.cost_purchase_price.value,
              "totalLiabilites":this.s.liabilities_in_relation_immovable_assets.value,
            },
          ]
        };
        this.submittedData.push({"assetsInfoData":assetsInfoInputParam});
        // start storing application data in database
        this.appService.saveAssestsInfoData(assetsInfoInputParam)
        .pipe(first())
        .subscribe(
          data => {
                  console.log("Response" + JSON.stringify(data));
                  //successfully inserted
                  if(data['statusCode'] == 200){                  
                      this.alertService.error('Application - Assests Info data saved successfully');
                      //this.router.navigate(['taxfilling/earnings']);
                  }
              },
          error => {
              this.alertService.error(error);
          });
        break;
        default:
          this.submittedData = [];
      }
      
      this.loading = false;
      this.perSubmitted = false;
      this.addSubmitted = false;
      this.bankSubmitted = false;
      this.assSubmitted = false;
  }

  autoFillPersonalInfoForm(){
    this.personalDetailsForm.get('EmailId').setValue(this.authenticationService.currentUserValue.email);
  }

  //Function Called on next button click
  on_next_click(){
    this.loading = true;
    if (this.step5 == true) {
      this.assSubmitted = true;
      console.log("Assests details submitted");
      if (this.assestsDetailsForm.invalid) {
        return;
      }else{
        this.onSubmit(this.assestsDetailsForm,'asstinfo');
        this.step2 = false;
        this.step3 = false;
        this.step4 = false;
        this.step5 = true;
      }
      
    }
    if (this.step4 == true) {
      this.bankSubmitted = true;
      console.log("Bank details submitted");
      if (this.bankDetailsForm.invalid) {
        return;
      }else{
        this.onSubmit(this.bankDetailsForm,'bankinfo');
        this.step2 = false;
        this.step3 = false;
        this.step4 = false;
        this.step5 = true;
      }
      
    }
    if (this.step3 == true) {
      this.addSubmitted = true;
      console.log("Address details submitted");
      if (this.addressDetailsForm.invalid) {
        return;
      }else{
        this.onSubmit(this.addressDetailsForm,'addressinfo');
        this.step2 = false;
        this.step3 = false;
        this.step4 = true;
        this.step5 = false;
      }
      
    }
    if (this.step2 == true) {
      this.perSubmitted = true;
      console.log("Personal details submitted");
      // stop here if form is invalid
      if (this.personalDetailsForm.invalid) {
        return;
      }else{
        this.onSubmit(this.personalDetailsForm,'personalinfo');
        this.step2 = false;
        this.step3 = true;
        this.step4 = false;
        this.step5 = false;
      }
    }
  }

  //Function Called on previous button click
  on_previous_click(){
    if (this.step2 == true) {
      this.step2 = true;
      this.step3 = false;
      this.step4 = false;
      this.step5 = false;
    }
    if (this.step3 == true) {
      this.step2 = true;
      this.step3 = false;
      this.step4 = false;
      this.step5 = false;
    }
    if (this.step4 == true) {
      this.step2 = false;
      this.step3 = true;
      this.step4 = false;
      this.step5 = false;
    }
    if (this.step5 == true) {
      this.step2 = false;
      this.step3 = false;
      this.step4 = true;
      this.step5 = false;
    }
  }
  
  //Function Called on Reset button click
  on_reset_click(){}

  //Function to enable forms from naviagtion icons
  select_form_step(a){
    if(a == 'step2'){
      this.step2 = true;
      this.step3 = false;
      this.step4 = false;
      this.step5 = false;
    }
    if(a == 'step3'){
      this.step2 = false;
      this.step3 = true;
      this.step4 = false;
      this.step5 = false;
    }
    if(a == 'step4'){
      this.step2 = false;
      this.step3 = false;
      this.step4 = true;
      this.step5 = false;
    }
    if(a == 'step5'){
      this.step2 = false;
      this.step3 = false;
      this.step4 = false;
      this.step5 = true;
    }
  }

  //Function to enable Assests subforms
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

  //Function to enable bank subforms
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
