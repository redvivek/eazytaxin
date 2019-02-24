import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Basicinfostep1, Personaldetails, Addressdetails, Bankdetails, Immovableassetsdetails, Assetsliabilitiesdetails } from '@app/_models';
import { ScriptService,AuthenticationService,ApplicationService, AlertService } from '@app/_services';

@Component({
  selector: 'app-personal-details',
  templateUrl: './personal-details.component.html',
  styleUrls: ['./personal-details.component.css']
})
export class PersonalDetailsComponent implements OnInit {
  //Initialize all sub forms
  personalDetailsForm: FormGroup;
  addressDetailsForm: FormGroup;
  bankDetailsForm: FormGroup;
  assestsDetailsForm: FormGroup;
  
  loading = false;
  immAssestsForm = true;
  //flag to check submitted event on each subform
  perSubmitted = false;
  addSubmitted = false;
  bankSubmitted = false;
  assSubmitted = false;
  submittedData = [];
  
  //flag to by default active perinfo tab
  step2:boolean = true;
  step3:boolean = false;
  step4:boolean = false;
  step5:boolean = false;
  //flag to by default active primary acc subtab
  step4_primary_bank_acc:boolean = true;
  step4_all_other_bank_acc:boolean = false;
  //flag to by default active immovable assest subtab
  step5_immovable:boolean = true;
  step5_movable:boolean = false;
  step5_foreign:boolean = false;

  //Global variables to save userdId and ApplictionID
  userId : number;
  ApplicationId : number;

  localStoreg = JSON.parse(localStorage.getItem("currentUserApp"));

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private appService : ApplicationService,
    private alertService : AlertService,
    private scriptservice : ScriptService
  ) {
      this.scriptservice.load('waveJS','mainJS').then(data => {
        console.log('script loaded ', data);
      }).catch(error => console.log(error));
      
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
      immovableAssetsFlag:['1'],
      Description: ['', Validators.required ],
      FlatNo: ['', Validators.required ],
      PremiseName: ['', Validators.required ],
      StreetName: ['', Validators.required ],
      AreaLocality: ['', Validators.required ],
      immovable_State: ['', Validators.required ],
      immovable_Pincode: ['', Validators.required ],
      country:['',Validators.required],
      cost_purchase_price:[0,Validators.required],
      liabilities_in_relation_immovable_assets:[0,Validators.required],
      MovJwellaryItemsAmount:[0,Validators.required],
      MovCraftItemsAmount:[0,Validators.required],
      MovConveninceItemsAmount:[0,Validators.required],
      MovFABankAmount:[0,Validators.required],
      MovFASharesAmount:[0,Validators.required],
      MovFAInsAmount:[0,Validators.required],
      MovFALoansGivenAmount:[0,Validators.required],
      MovInHandCashAmount:[0,Validators.required],
      TotalLiability:[0,Validators.required],
      inputGroupFile01:[''] 
    });

    this.autoFillPersonalInfoForm();
  }

  get f() { return this.personalDetailsForm.controls; }
  get a() { return this.addressDetailsForm.controls; }
  get b() { return this.bankDetailsForm.controls; }
  get s() { return this.assestsDetailsForm.controls; }

  /* Function to enable/disable & validate file upload form field on Radio change event */
  onChange(event): void {
    const newVal = event.target.value;
    console.log("asDas" +newVal);
    const immAssetsDetails = this.assestsDetailsForm.get('Description');
    const inputflatno = this.assestsDetailsForm.get('FlatNo');
    const inputPremnm = this.assestsDetailsForm.get('PremiseName');
    const inputStreetnm = this.assestsDetailsForm.get('StreetName');
    const inputArea = this.assestsDetailsForm.get('AreaLocality');
    const inputState = this.assestsDetailsForm.get('immovable_State');
    const inputPincode = this.assestsDetailsForm.get('immovable_Pincode');
    const inputCountry = this.assestsDetailsForm.get('country');
    const inputCost = this.assestsDetailsForm.get('cost_purchase_price');
    const inputTotalLiabilites = this.assestsDetailsForm.get('liabilities_in_relation_immovable_assets');

    if (newVal == true) {
      this.immAssestsForm = true;
      immAssetsDetails.setValidators([Validators.required]);
      inputflatno.setValidators([Validators.required]);
      inputPremnm.setValidators([Validators.required]);
      inputStreetnm.setValidators([Validators.required]);
      inputArea.setValidators([Validators.required]);
      inputState.setValidators([Validators.required]);
      inputPincode.setValidators([Validators.required]);
      inputCountry.setValidators([Validators.required]);
      inputCost.setValidators([Validators.required]);
      inputTotalLiabilites.setValidators([Validators.required]);
    }
    else {
      this.immAssestsForm = false;
      immAssetsDetails.clearValidators();
      inputflatno.clearValidators();
      inputPremnm.clearValidators();
      inputStreetnm.clearValidators();
      inputArea.clearValidators();
      inputState.clearValidators();
      inputPincode.clearValidators();
      inputCountry.clearValidators();
      inputCost.clearValidators();
      inputTotalLiabilites.clearValidators();

    }
    immAssetsDetails.updateValueAndValidity();
    inputflatno.updateValueAndValidity();
    inputPremnm.updateValueAndValidity();
    inputStreetnm.updateValueAndValidity();
    inputArea.updateValueAndValidity();
    inputState.updateValueAndValidity();
    inputPincode.updateValueAndValidity();
    inputCountry.updateValueAndValidity();
    inputCost.updateValueAndValidity();
    inputTotalLiabilites.updateValueAndValidity();
  }

  onSubmit(formname,infoType) {
    var perInfoInputParam,addInfoInputParam,bankInfoInputParam,assetsInfoInputParam,ImmovableAssInputParam;  
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
            this.submittedData.push({"personalInfoData":perInfoInputParam});
            // start storing application data in database
            this.appService.savePersonalInfoData(perInfoInputParam)
            .pipe(first())
            .subscribe(
              data => {
                      console.log("Response" + JSON.stringify(data));
                      //successfully inserted
                      if(data['statusCode'] == 200){                  
                          this.alertService.success('Application - Personal Info data saved successfully');
                          this.localStoreg['applicationStage'] = 4;
                          //console.log("LocalStore" + JSON.stringify(this.localStoreg));
                          localStorage.removeItem("currentUserApp");
                          localStorage.setItem("currentUserApp", JSON.stringify(this.localStoreg));
                          this.loading = false;
                          this.step2 = false;
                          this.step3 = true;
                          this.step4 = false;
                          this.step5 = false;
                      }
                  },
              error => {
                this.alertService.error('Application - Personal Info data save request failed '+error);
                this.loading = false;
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
                      this.alertService.success('Application - Address Info data saved successfully');
                      this.localStoreg['applicationStage'] = 5;
                      //console.log("LocalStore" + JSON.stringify(this.localStoreg));
                      localStorage.removeItem("currentUserApp");
                      localStorage.setItem("currentUserApp", JSON.stringify(this.localStoreg));
                      this.loading = false;
                      this.step2 = false;
                      this.step3 = false;
                      this.step4 = true;
                      this.step5 = false;
                  }
              },
          error => {
              this.alertService.error('Application - Address Info data save request failed '+error);
              this.loading = false;
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
                      this.alertService.success('Application - Bank Info data saved successfully');
                      this.localStoreg['applicationStage'] = 6;
                      //console.log("LocalStore" + JSON.stringify(this.localStoreg));
                      localStorage.removeItem("currentUserApp");
                      localStorage.setItem("currentUserApp", JSON.stringify(this.localStoreg));
                      this.loading = false;
                      this.step2 = false;
                      this.step3 = false;
                      this.step4 = false;
                      this.step5 = true;

                  }
              },
          error => {
              this.alertService.error('Application - Bank Info data save request failed '+error );
              this.loading = false;
          });
        break;
        case "asstinfo":
          assetsInfoInputParam = {
            'appId':this.ApplicationId,
            'userId':this.userId,
            "immovableAssetsFlag":this.s.immovableAssetsFlag.value,
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
          };
          if(this.s.immovableAssetsFlag.value == 1){
            ImmovableAssInputParam = {
              'appId':this.ApplicationId,
              'userId':this.userId,
              "description":this.s.Description.value,
              "flatNo":this.s.FlatNo.value,
              "premiseName":this.s.PremiseName.value,
              "streetName":this.s.StreetName.value,
              "locality":this.s.AreaLocality.value,
              "state":this.s.immovable_State.value,
              "pincode":this.s.immovable_Pincode.value,
              "country":this.s.country.value,
              "purchaseCost":this.s.cost_purchase_price.value,
              "totalLiabilites":this.s.liabilities_in_relation_immovable_assets.value
            };
          }else{
            ImmovableAssInputParam = "";
          }
        
        this.submittedData.push({"assetsInfoData":assetsInfoInputParam,"immAssetsInfoData":ImmovableAssInputParam});
        // start storing application data in database
        this.appService.saveAssestsInfoData(assetsInfoInputParam)
        .pipe(first())
        .subscribe(
          data => {
                  console.log("Response" + JSON.stringify(data));
                  //successfully inserted
                  if(data['statusCode'] == 200){
                      var assInfoId = data['assInfoId'];
                      //var obj = JSON.parse(ImmovableAssInputParam);
                      //obj['assInfoId'] = assInfoId;
                      //ImmovableAssInputParam = JSON.stringify(obj);
                      if(this.s.immovableAssetsFlag.value == 1){ 
                        this.appService.saveImmAssestsInfoData(assInfoId,ImmovableAssInputParam)
                        
                        .pipe(first())
                        .subscribe(
                          data => {
                                  console.log("Response" + JSON.stringify(data));
                                  //successfully inserted
                                  if(data['statusCode'] == 200){ 
                                        this.alertService.error('Application - Assests Info data saved successfully');
                                        this.localStoreg['applicationStage'] = 7;
                                        //console.log("LocalStore" + JSON.stringify(this.localStoreg));
                                        localStorage.removeItem("currentUserApp");
                                        localStorage.setItem("currentUserApp", JSON.stringify(this.localStoreg));
                                        this.loading = false;
                                        this.router.navigate(['taxfilling/earnings']);
                                      }                
                              },
                          error => {
                              this.alertService.error('Application - Assests & Liabilites data save request failed '+error);
                              this.loading = false;
                          });    
                      }else{
                        this.alertService.error('Application - Assests Info data saved successfully');
                        this.localStoreg['applicationStage'] = 7;
                        //console.log("LocalStore" + JSON.stringify(this.localStoreg));
                        localStorage.removeItem("currentUserApp");
                        localStorage.setItem("currentUserApp", JSON.stringify(this.localStoreg));
                        this.loading = false;
                        this.router.navigate(['taxfilling/earnings']);
                      }                
                  }
              },
          error => {
              this.alertService.error('Application - Assests & Liabilites data save request failed '+error);
              this.loading = false;
          });
        break;
        default:
          this.submittedData = [];
      }
  }

  autoFillPersonalInfoForm(){
    this.personalDetailsForm.get('EmailId').setValue(this.authenticationService.currentUserValue.email);
  }

  //Function Called on next button click
  on_next_click(){
    if (this.step5 == true) {
      this.assSubmitted = true;
      this.loading = true;
      console.log("Assests details submitted");
      if (this.assestsDetailsForm.invalid) {
        return;
      }else{
        this.onSubmit(this.assestsDetailsForm,'asstinfo');
      }
      
    }
    if (this.step4 == true) {
      this.bankSubmitted = true;
      this.loading = true;
      console.log("Bank details submitted");
      if (this.bankDetailsForm.invalid) {
        return;
      }else{
        this.onSubmit(this.bankDetailsForm,'bankinfo');
      }
      
    }
    if (this.step3 == true) {
      this.addSubmitted = true;
      this.loading = true;
      console.log("Address details submitted");
      if (this.addressDetailsForm.invalid) {
        return;
      }else{
        this.onSubmit(this.addressDetailsForm,'addressinfo');
      }
      
    }
    if (this.step2 == true) {
      this.perSubmitted = true;
      this.loading = true;
      console.log("Personal details submitted");
      // stop here if form is invalid
      if (this.personalDetailsForm.invalid) {
        return;
      }else{
        this.onSubmit(this.personalDetailsForm,'personalinfo');
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
