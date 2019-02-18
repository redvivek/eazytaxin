import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { ScriptService,AuthenticationService,ApplicationService, AlertService } from '@app/_services';

@Component({
  selector: 'app-deductions',
  templateUrl: './deductions.component.html',
  styleUrls: ['./deductions.component.css']
})
export class DeductionsComponent implements OnInit {
  mainDeductionForm: FormGroup;
  otherDeductionForm: FormGroup;
  proofDocUploadForm: FormGroup;

  loading = false;

  //flag to check submitted event on each subform
  mainFSubmitted = false;
  otherFSubmitted = false;
  uploadFSubmitted = false;

  submittedData = [];

  //initilize & activate flag to by default active salaryIncome tab
  step1:boolean = true;
  step2:boolean = false;
  step3:boolean = false;

  //initilize & activate flag to by default active salaryIncome subtab
  step1_section80C :boolean = true;
  step1_section80D :boolean = true;
  step1_section80TTA :boolean = false;
  step1_section80G :boolean = false;
  
  //initilize & activate flag to by default active otherIncome subtab
  step2_section80CCCG :boolean = true;
  step2_section80E :boolean = false;
  step2_section80CCA :boolean = false;
  step2_section80CCD1 :boolean = false;
  step2_section80CCD2 :boolean = false;
  step2_section80GG :boolean = false;
  step2_section80DDB :boolean = false;
  step2_section80EE :boolean = false;
  step2_section80QQB :boolean = false;
  step2_section80RRB :boolean = false;
  step2_section80GGA :boolean = false;
  step2_section80GGC :boolean = false;
  step2_section80U :boolean = false;
  step2_section80DD :boolean = false;
  

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
    this.mainDeductionForm = this.formBuilder.group({
      uploadForm16File: ['', Validators.required ],
      uploadFilePassword: [''],
      uploadForm16FileFlag:[''],
      inputEmployernm:['',, Validators.required],
      inputEmployertype:['',, Validators.required],
      inputSalary: ['', Validators.required]
    });

    this.otherDeductionForm = this.formBuilder.group({
      uploadForm16File: ['', Validators.required ],
      uploadFilePassword: [''],
      uploadForm16FileFlag:[''],
      inputEmployernm:['',, Validators.required],
      inputEmployertype:['',, Validators.required],
      inputSalary: ['', Validators.required]
    });

    this.proofDocUploadForm = this.formBuilder.group({
      uploadForm16File: ['', Validators.required ],
      uploadFilePassword: [''],
      uploadForm16FileFlag:[''],
      inputEmployernm:['',, Validators.required],
      inputEmployertype:['',, Validators.required],
      inputSalary: ['', Validators.required]
    });

    this.autoFillMainDeductionForm()

  }

  get m() { return this.mainDeductionForm.controls; }
  get o() { return this.otherDeductionForm.controls; }
  get f() { return this.proofDocUploadForm.controls; }

  autoFillMainDeductionForm(){
    //this.mainDeductionForm.get('uploadForm16FileFlag').setValue("1");
  }

  autoFillOtherDeductionForm(){
    //this.otherDeductionForm.get('uploadOtherIncomeProofFlag').setValue("1");
  }

  autoFillDocUploadForm(){
    //this.proofDocUploadForm.get('uploadHouseIncomeProofFlag').setValue("1");
  }

  //Function Called on next button click
  on_next_click(){
    if (this.step3 == true) {
      this.uploadFSubmitted = true;
      this.loading = true;
      console.log("Doc upload details submitted");
      if (this.proofDocUploadForm.invalid) {
        return;
      }else{
        this.onSubmit(this.proofDocUploadForm,'docUploadDetails');
      }
      
    }
    if (this.step2 == true) {
      this.otherFSubmitted = true;
      this.loading = true;
      console.log("Other Deduction details submitted");
      // stop here if form is invalid
      if (this.otherDeductionForm.invalid) {
        return;
      }else{
        this.onSubmit(this.otherDeductionForm,'otherDeductionsDetails');
      }
    }
    
    if (this.step1 == true) {
      this.mainFSubmitted = true;
      this.loading = true;
      console.log("Main Deduction details submitted");
      // stop here if form is invalid
      if (this.mainDeductionForm.invalid) {
        return;
      }else{
        this.onSubmit(this.mainDeductionForm,'salIncomeDetails');
      }
    }
  }

  onSubmit(formname,infoType) {
    /*var salIncomeInputParam,othIncomeInputParam,houseIncomeInputParam,rentIncomeInputParam,capIncomeInputParam;  
    console.log('SUCCESS!! :-)\n\n' + JSON.stringify(formname.value))
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
      }*/
  }

  //Function Called on previous button click
  on_previous_click(){
    if (this.step2 == true) {
      this.step1 = true;
      this.step2 = false;
      this.step3 = false;

      this.autoFillOtherDeductionForm();
    }
    if (this.step3 == true) {
      this.step1 = false;
      this.step2 = true;
      this.step3 = false;

      this.autoFillDocUploadForm();
    }
  }

  //Function to enable forms from naviagtion icons
  select_form_step(a){
    if(a == 'step1'){
      this.step1 = true;
      this.step2 = false;
      this.step3 = false;
      this.autoFillMainDeductionForm();
    }
    if(a == 'step2'){
      this.step1 = false;
      this.step2 = true;
      this.step3 = false;
      this.autoFillOtherDeductionForm();
    }
    if(a == 'step3'){
      this.step1 = false;
      this.step2 = false;
      this.step3 = true;
      this.autoFillDocUploadForm();
    }
  }

}
