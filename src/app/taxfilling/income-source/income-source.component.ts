import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { ScriptService,AuthenticationService,ApplicationService, AlertService } from '@app/_services';

@Component({
  selector: 'app-income-source',
  templateUrl: './income-source.component.html',
  styleUrls: ['./income-source.component.css']
})
export class IncomeSourceComponent implements OnInit {
  //Initialize all sub forms
  salaryIncomeForm: FormGroup;
  otherIncomeForm: FormGroup;
  housePropIncomeForm: FormGroup;
  rentalPropIncomeForm: FormGroup;
  captialIncomeForm: FormGroup;

  loading = false;

  //flag to check submitted event on each subform
  salFSubmitted = false;
  othFSubmitted = false;
  houFSubmitted = false;
  renFSubmitted = false;
  capFSubmitted = false;
  
  submittedData = [];

  //initilize & activate flag to by default active salaryIncome tab
  step1:boolean = true;
  step2:boolean = false;
  step3:boolean = false;
  step4:boolean = false;
  step5:boolean = false;

  //initilize & activate flag to by default active salaryIncome subtab
  step1_income_salary_upload :boolean = true;
  step1_income_from_salary:boolean = false;
  //initilize & activate flag to by default active otherIncome subtab
  step2_income_other_upload :boolean = true;
  step2_income_other_data:boolean = false;
  //initilize & activate flag to by default active houseIncome subtab
  step3_house_property_upload :boolean = true;
  step3_house_property_data:boolean = false;
  //initilize & activate flag to by default active rentalIncome subtab
  step4_rental_property_upload :boolean = true;
  step4_rental_property_data:boolean = false;

  //Global variables to save userdId and ApplictionID
  userId : number;
  ApplicationId : number;

  //Read localstorage in progress application values
  localStoreg = JSON.parse(localStorage.getItem("currentUserApp"));


  constructor( 
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private appService : ApplicationService,
    private alertService : AlertService,
    private scriptservice : ScriptService
  ) 
  {
    this.scriptservice.load('mainJS').then(data => {
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
    this.salaryIncomeForm = this.formBuilder.group({
      uploadForm16File: [''],
      uploadFilePassword: [''],
      uploadForm16FileFlag:[''],
      inputEmployernm:['', Validators.required],
      inputEmployertype:['', Validators.required],
      inputSalary: ['', Validators.required]
    });

    this.otherIncomeForm = this.formBuilder.group({
      uploadOtherIncomeProofFile: [''],
      uploadOtherIncomeFilePwd: [''],
      uploadOtherIncomeProofFlag:[''],
      inputSavingsIncome:[''],
      inputFDInterestIncome: [''],
      inputAnyOtherIncome: ['' ],
      inputSharesIncome: [''],
      inputExemptIncome: ['' ],
      inputOtherExemptIncome: ['' ],
      inputAgriIncome:[''],
      inputAgriExpend:[''],
      inputAgriLoss: [''],
      inputDepAmount: ['' ],
      inputDepPersonName: ['' ],
      inputDepPersonRel:[''],
      inputDepIncomeNature:[''],
      inputPFIncome: ['' ],
      inputPFIncomeTax:['']
    });

    this.housePropIncomeForm = this.formBuilder.group({
      uploadHousePropDocs: [''],
      uploadHousePropDocsPwd: [''],
      uploadHouseIncomeProofFlag:[''],
      inpSelfOccPropFlatNo: ['' ],
      inpSelfOccPropPremise : [''],
      inpSelfOccPropStreet: [''],
      inpSelfOccPropArea: ['' ],
      inpSelfOccPropCity: ['' ],
      inpSelfOccPropPincode:[''],
      inpSelfOccPropCountry:[''],
      inpSelfOccPropState:[''],
      
      inpSelfOccPropLoanFlag: [''],
      inpSelfOccPropInterset: ['' ],
      
      inpCOFlag: ['' ],
      inpSelfShare:[''],
      inpCOName:[''],
      inpCOPan: ['' ],
      inpCOShare:['']
    });

    this.rentalPropIncomeForm = this.formBuilder.group({
      uploadRentalPropDocs: [''],
      uploadRentalPropDocsPwd: [''],
      uploadRentalIncomeProofFlag:[''],
      inpRentalPropFlatNo: ['' ],
      inpRentalPropPremise : [''],
      inpRentalPropStreet: [''],
      inpRentalPropArea: ['' ],
      inpRentalPropCity: ['' ],
      inpRenPropPincode : [''],
      inpRentalPropCountry:[''],
      inpRentalPropState:[''],
      
      inpRentalPropRentRec : [''],
      inpRentalPropHousetax : [''],
      inpRentalPropTenName:[''],
      inpRentalPropTenPan:[''],
      
      inpRentalPropLoanFlag: [''],
      inpRentalPropInterset: ['' ],
      inpRenCOFlag: ['' ],
      inpRenSelfShare:[''],
      inpRenUnRealRent:[''],
      inpRenCOName:[''],
      inpRenCOPan: ['' ],
      inpRenCOShare:['']
    });

    this.captialIncomeForm = this.formBuilder.group({
      uploadShareIncomeProof: [''],
      uploadLandSaleIncomeProof: [''],
      uploadAssestSaleIncomeProof: ['' ],
      uploadMFSaleIncomeProof : [''],

      uploadShareIncomeProofFlag: [''],
      uploadLandSaleIncomeProofFlag: [''],
      uploadAssestSaleIncomeProofFlag: ['' ],
      uploadMFSaleIncomeProofFlag : [''],
    });

    this.autoFillSalaryIncomeForm()
  }

  get s() { return this.salaryIncomeForm.controls; }
  get o() { return this.otherIncomeForm.controls; }
  get h() { return this.housePropIncomeForm.controls; }
  get r() { return this.rentalPropIncomeForm.controls; }
  get c() { return this.captialIncomeForm.controls; }

  autoFillSalaryIncomeForm(){
    this.salaryIncomeForm.get('uploadForm16FileFlag').setValue("1");
  }

  autoFillOtherIncomeForm(){
    this.otherIncomeForm.get('uploadOtherIncomeProofFlag').setValue("1");
  }

  autoFillHouseIncomeForm(){
    this.housePropIncomeForm.get('uploadHouseIncomeProofFlag').setValue("1");
  }

  autoFillRentalIncomeForm(){
    this.rentalPropIncomeForm.get('uploadRentalIncomeProofFlag').setValue("1");
  }

  autoFillCapitalIncomeForm(){
    this.captialIncomeForm.get('uploadShareIncomeProofFlag').setValue("1");
    this.captialIncomeForm.get('uploadLandSaleIncomeProofFlag').setValue("1");
    this.captialIncomeForm.get('uploadAssestSaleIncomeProofFlag').setValue("1");
    this.captialIncomeForm.get('uploadMFSaleIncomeProofFlag').setValue("1");
  }

  //Function Called on next button click
  on_next_click(){
    if (this.step5 == true) {
      this.capFSubmitted = true;
      this.loading = true;
      console.log("Capital Income submitted");
      if (this.captialIncomeForm.invalid) {
        return;
      }else{
        this.onSubmit(this.captialIncomeForm,'capIncomeDetails');
      }
      
    }
    if (this.step4 == true) {
      this.renFSubmitted = true;
      this.loading = true;
      console.log("Rental property details submitted");
      if (this.rentalPropIncomeForm.invalid) {
        return;
      }else{
        this.onSubmit(this.rentalPropIncomeForm,'renIncomeDetails');
      }
      
    }
    if (this.step3 == true) {
      this.houFSubmitted = true;
      this.loading = true;
      console.log("House Prop details submitted");
      if (this.housePropIncomeForm.invalid) {
        return;
      }else{
        this.onSubmit(this.housePropIncomeForm,'houseIncomeDetails');
      }
      
    }
    if (this.step2 == true) {
      this.othFSubmitted = true;
      this.loading = true;
      console.log("Other Income details submitted");
      // stop here if form is invalid
      if (this.otherIncomeForm.invalid) {
        return;
      }else{
        this.onSubmit(this.otherIncomeForm,'otherIncomeDetails');
      }
    }
    
    if (this.step1 == true) {
      this.salFSubmitted = true;
      this.loading = true;
      console.log("Salary Income details submitted");
      // stop here if form is invalid
      if (this.salaryIncomeForm.invalid) {
        return;
      }else{
        this.onSubmit(this.salaryIncomeForm,'salIncomeDetails');
      }
    }
  }


  onSubmit(formname,infoType) {
    var salIncomeInputParam,othIncomeInputParam,houseIncomeInputParam,rentIncomeInputParam,capIncomeInputParam;  
    console.log('SUCCESS!! :-)\n\n' + JSON.stringify(formname.value));
      switch(infoType){
        case "salIncomeDetails":
          salIncomeInputParam = {
              'appId':this.ApplicationId,
              'userId':this.userId,
              "uploadDocFlag":this.s.uploadForm16FileFlag,
              "employernm":this.s.inputEmployernm,
              "employertype":this.s.inputEmployertype,
              "salamount":this.s.inputSalary
            };
            this.submittedData.push({"salIncomeData":salIncomeInputParam});
            //console.log('Submitted Data Array!! :-)' + JSON.stringify(this.submittedData));
            // start storing application data in database
            this.appService.saveSalIncomeDetails(salIncomeInputParam)
            .pipe(first())
            .subscribe(
              data => {
                      console.log("Response" + JSON.stringify(data));
                      //successfully inserted
                      if(data['statusCode'] == 200){                  
                          this.alertService.success('Application - Salary Income data saved successfully');
                          this.localStoreg['applicationStage'] = 9;
                          //console.log("LocalStore" + JSON.stringify(this.localStoreg));
                          localStorage.removeItem("currentUserApp");
                          localStorage.setItem("currentUserApp", JSON.stringify(this.localStoreg));
                          this.loading = false;
                          this.step1 = false;
                          this.step2 = true;
                          this.step3 = false;
                          this.step4 = false;
                          this.step5 = false;

                          this.autoFillOtherIncomeForm();
                      }
                  },
              error => {
                this.alertService.error('Application - Salary Income data save request failed '+error);
                this.loading = false;
              });
        break;
        case "otherIncomeDetails":
          othIncomeInputParam = {
            'appId':this.ApplicationId,
            'userId':this.userId,
            "uploadDocFlag":this.o.uploadOtherIncomeProofFlag,
            "savingsIncome":this.o.inputSavingsIncome,
            "fdincome":this.o.inputFDInterestIncome,
            "othericnome":this.o.inputAnyOtherIncome,
            "shareincome":this.o.inputSharesIncome,
            "exemptincome":this.o.inputExemptIncome,
            "otherexemptincome":this.o.inputOtherExemptIncome,
            "agriincome":this.o.inputAgriIncome,
            "agriexpend":this.o.inputAgriExpend,
            "agriloss":this.o.inputAgriLoss,
            "depincome":this.o.inputDepAmount,
            "depname":this.o.inputDepPersonName,
            "deprelation":this.o.inputDepPersonRel,
            "depincomeNature":this.o.inputDepIncomeNature,
            "pfincome":this.o.inputPFIncome,
            "pfincometax":this.o.inputPFIncomeTax
          };
        this.submittedData.push({"otherIncomeData":othIncomeInputParam});
        // start storing application data in database
        this.appService.saveOtherIncomeDetails(othIncomeInputParam)
        .pipe(first())
        .subscribe(
          data => {
                  console.log("Response" + JSON.stringify(data));
                  //successfully inserted
                  if(data['statusCode'] == 200){                  
                      this.alertService.success('Application - OtherIncome data saved successfully');
                      this.localStoreg['applicationStage'] = 10;
                      //console.log("LocalStore" + JSON.stringify(this.localStoreg));
                      localStorage.removeItem("currentUserApp");
                      localStorage.setItem("currentUserApp", JSON.stringify(this.localStoreg));
                      this.loading = false;
                      this.step1 = false;
                      this.step2 = false;
                      this.step3 = true;
                      this.step4 = false;
                      this.step5 = false;

                      this.autoFillHouseIncomeForm();
                  }
              },
          error => {
              this.alertService.error('Application - OtherIncome data save request failed '+error);
              this.loading = false;
          });
        break;
        case "houseIncomeDetails":
          houseIncomeInputParam = {
            'appId':this.ApplicationId,
            'userId':this.userId,
            "uploadDocFlag":this.h.uploadHouseIncomeProofFlag,
            "flatno":this.h.inpSelfOccPropFlatNo,
            "premises":this.h.inpSelfOccPropPremise,
            "street":this.h.inpSelfOccPropStreet,
            "area":this.h.inpSelfOccPropArea,
            "city":this.h.inpSelfOccPropCity,
            "pincode":this.h.inpSelfOccPropPincode,
            "country":this.h.inpSelfOccPropCountry,
            "state":this.h.inpSelfOccPropState,

            "proploanflag":this.h.inpSelfOccPropLoanFlag,
            "propinterestpaid":this.h.inpSelfOccPropInterset,

            "coflag":this.h.inpCOFlag,
            "selfshare":this.h.inpSelfShare,
            "coname":this.h.inpCOName,
            "copan":this.h.inpCOPan,
            "coshare":this.h.inpCOShare
          };
        this.submittedData.push({"bankInfoData":houseIncomeInputParam});
        // start storing application data in database
        this.appService.saveHouseIncomeDetails(houseIncomeInputParam)
        .pipe(first())
        .subscribe(
          data => {
                  console.log("Response" + JSON.stringify(data));
                  //successfully inserted
                  if(data['statusCode'] == 200){                  
                      this.alertService.success('Application - House Property details saved successfully');
                      this.localStoreg['applicationStage'] = 11;
                      //console.log("LocalStore" + JSON.stringify(this.localStoreg));
                      localStorage.removeItem("currentUserApp");
                      localStorage.setItem("currentUserApp", JSON.stringify(this.localStoreg));
                      this.loading = false;
                      this.step1 = false;
                      this.step2 = false;
                      this.step3 = false;
                      this.step4 = true;
                      this.step5 = false;

                      this.autoFillRentalIncomeForm();
                  }
              },
          error => {
              this.alertService.error('Application - House property detailes save request failed '+error );
              this.loading = false;
          });
        break;
        case "renIncomeDetails":
          rentIncomeInputParam = {
            'appId':this.ApplicationId,
            'userId':this.userId,
            "uploadDocFlag":this.r.uploadRentalIncomeProofFlag,

            "flatno":this.r.inpRentalPropFlatNo,
            "premises":this.r.inpRentalPropPremise,
            "street":this.r.inpRentalPropStreet,
            "area":this.r.inpRentalPropArea,
            "city":this.r.inpRentalPropCity,
            "pincode":this.r.inpRentalPropPincode,
            "country":this.r.inpRentalPropCountry,
            "state":this.r.inpRentalPropState,

            "rentAmountRcvd":this.r.inpRentalPropRentRec,
            "rentHouseTaxPaid":this.r.inpRentalPropHousetax,
            "rentalTenantNm":this.r.inpRentalPropTenName,
            "rentalTenantPan":this.r.inpRentalPropTenPan,
            
            "rentalPropLoanFlag":this.r.inpRentalPropLoanFlag,
            "rentalpropInterestPaid":this.r.inpRentalPropInterset,

            "coflag":this.r.inpRenCOFlag,
            "selfshare":this.r.inpRenSelfShare,
            "unRealizedRent":this.r.inpRenUnRealRent,
            "coname":this.r.inpRenCOName,
            "copan":this.r.inpRenCOPan,
            "coshare":this.r.inpRenCOShare
          };
        
        this.submittedData.push({"rentalIncomeData":rentIncomeInputParam});
        // start storing application data in database
        this.appService.saveRentalIncomeDetails(rentIncomeInputParam)
        .pipe(first())
        .subscribe(
          data => {
                  console.log("Response" + JSON.stringify(data));
                  //successfully inserted
                  if(data['statusCode'] == 200){
                        this.alertService.error('Application - Rental Income data saved successfully');
                        this.localStoreg['applicationStage'] = 12;
                        //console.log("LocalStore" + JSON.stringify(this.localStoreg));
                        localStorage.removeItem("currentUserApp");
                        localStorage.setItem("currentUserApp", JSON.stringify(this.localStoreg));
                        this.loading = false;
                        this.loading = false;
                        this.step1 = false;
                        this.step2 = false;
                        this.step3 = false;
                        this.step4 = false;
                        this.step5 = true;

                        this.autoFillCapitalIncomeForm();
                      }                
              },
          error => {
              this.alertService.error('Application - Rental Income data save request failed '+error);
              this.loading = false;
          });
        break;

        case "capIncomeDetails":
          capIncomeInputParam = {
            'appId':this.ApplicationId,
            'userId':this.userId,
            "shareIncomeFlag":this.c.uploadShareIncomeProofFlag.value,
            "landsaleproof":this.c.uploadLandSaleIncomeProofFlag.value,
            "assestSaleProof":this.c.uploadAssestSaleIncomeProofFlag.value,
            "MFSaleProof":this.c.uploadMFSaleIncomeProofFlag.value,
          };
          
        
        this.submittedData.push({"CapitalIncomeData":capIncomeInputParam});
        // start storing application data in database
        this.appService.saveCapitalIncomeDetails(capIncomeInputParam)
        .pipe(first())
        .subscribe(
          data => {
                  console.log("Response" + JSON.stringify(data));
                  //successfully inserted
                  if(data['statusCode'] == 200){
                        this.alertService.error('Application - Captial Gains data saved successfully');
                        this.localStoreg['applicationStage'] = 13;
                        //console.log("LocalStore" + JSON.stringify(this.localStoreg));
                        localStorage.removeItem("currentUserApp");
                        localStorage.setItem("currentUserApp", JSON.stringify(this.localStoreg));
                        this.loading = false;
                        this.router.navigate(['taxfilling/deductions']);
                      }                
              },
          error => {
              this.alertService.error('Application - Captial Gains data save request failed '+error);
              this.loading = false;
          });
        break;
        default:
          this.submittedData = [];
      }
  }

  //Function Called on previous button click
  on_previous_click(){
    if (this.step2 == true) {
      this.step1 = true;
      this.step2 = false;
      this.step3 = false;
      this.step4 = false;
      this.step5 = false;

      this.autoFillSalaryIncomeForm();
    }
    if (this.step3 == true) {
      this.step1 = false;
      this.step2 = true;
      this.step3 = false;
      this.step4 = false;
      this.step5 = false;

      this.autoFillOtherIncomeForm();
    }
    if (this.step4 == true) {
      this.step1 = false;
      this.step2 = false;
      this.step3 = true;
      this.step4 = false;
      this.step5 = false;

      this.autoFillHouseIncomeForm();
    }
    if (this.step5 == true) {
      this.step1 = false;
      this.step2 = false;
      this.step3 = false;
      this.step4 = true;
      this.step5 = false;

      this.autoFillRentalIncomeForm();
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
      this.autoFillSalaryIncomeForm();
    }
    if(a == 'step2'){
      this.step1 = false;
      this.step2 = true;
      this.step3 = false;
      this.step4 = false;
      this.step5 = false;
      this.autoFillOtherIncomeForm();
    }
    if(a == 'step3'){
      this.step1 = false;
      this.step2 = false;
      this.step3 = true;
      this.step4 = false;
      this.step5 = false;
      this.autoFillHouseIncomeForm();
    }
    if(a == 'step4'){
      this.step1 = false;
      this.step2 = false;
      this.step3 = false;
      this.step4 = true;
      this.step5 = false;
      this.autoFillRentalIncomeForm();
    }
    if(a == 'step5'){
      this.step1 = false;
      this.step2 = false;
      this.step3 = false;
      this.step4 = false;
      this.step5 = true;
      this.autoFillCapitalIncomeForm();
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
    if(x == 'house_property_upload'){
      this.step3_house_property_upload = true;
      this.step3_house_property_data = false;
    }
    if(x == 'house_property_data'){
      this.step3_house_property_upload = false;
      this.step3_house_property_data = true;
    }
  }

  select_step4_subpart_form(x){
    if(x == 'rental_property_upload'){
      this.step4_rental_property_upload = true;
      this.step4_rental_property_data = false;
    }
    if(x == 'rental_property_data'){
      this.step4_rental_property_upload = false;
      this.step4_rental_property_data = true;
    }
  }
}
