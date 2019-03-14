import { Component, OnInit,AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { environment } from '@environments/environment';
import { ScriptService,AuthenticationService,ApplicationService, AlertService } from '@app/_services';
import { handleInsideHeaderBackground,handleFloatingLabels } from '../../app.helpers';
import * as Waves from 'node-waves';

const URL = `${environment.apiUrl}/tax/uploadproofDocuments`;

@Component({
  selector: 'app-income-source',
  templateUrl: './income-source.component.html',
  styleUrls: ['./income-source.component.css']
})
export class IncomeSourceComponent implements OnInit,AfterViewInit {
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
  step2_income_other_upload :boolean = false;
  step2_income_other_data:boolean = true;
  //initilize & activate flag to by default active houseIncome subtab
  step3_house_property_upload :boolean = false;
  step3_house_property_data:boolean = true;
  //initilize & activate flag to by default active rentalIncome subtab
  step4_rental_property_upload :boolean = false;
  step4_rental_property_data:boolean = true;

  //Global variables to save userdId and ApplictionID
  userId : number;
  ApplicationId : number;
  fileName = '';
  nextButtonDisable = false;
  previousButtonDisable = false;

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
    // redirect to login if not logged in
    if (!this.authenticationService.currentUserValue) { 
      this.router.navigate(['/login']);
    }else{
      //console.log("Current user value "+ JSON.stringify(this.authenticationService.currentUserValue));
      console.log("Current App value "+ this.appService.currentApplicationValue);
      this.userId         = this.authenticationService.currentUserValue.userid;
      if(this.appService.currentApplicationValue != null){
        this.ApplicationId  = this.appService.currentApplicationValue.appId;
      }else{
        this.nextButtonDisable = true;
        this.previousButtonDisable = true;
      }
      console.log("Current App Id "+ this.ApplicationId);
    }
  }

  public uploader: FileUploader = new FileUploader({
    url: URL, 
    itemAlias: 'uploadIncomeProofs'
  });

  //public otherUploader

  ngOnInit() {
    this.salaryIncomeForm = this.formBuilder.group({
      uploadForm16File: [''],
      uploadFilePassword: [''],
      uploadForm16FileFlag:['', Validators.required],
      inputEmployernm:['', Validators.required],
      inputEmployertype:['', Validators.required],
      inputSalary: ['', Validators.required]
    });

    this.otherIncomeForm = this.formBuilder.group({
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
      inputPFIncomeTax:[''],
      uploadOtherIncomeProofFile: [''],
      uploadOtherIncomeFilePwd: [''],
      uploadOtherIncomeProofFlag:['']
    },{validator: this.makeFileUploadMandatory('inputSavingsIncome','inputFDInterestIncome','inputAnyOtherIncome','inputSharesIncome','inputExemptIncome','inputOtherExemptIncome','inputAgriIncome','inputDepAmount','inputPFIncome','uploadOtherIncomeProofFlag')}
    );

    this.housePropIncomeForm = this.formBuilder.group({
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
      inpCOShare:[''],

      uploadHousePropDocs: [''],
      uploadHousePropDocsPwd: [''],
      uploadHouseIncomeProofFlag:[''],
    },{validator: this.makeHouseFileUploadMandatory('inpSelfOccPropFlatNo','inpSelfOccPropPremise','inpSelfOccPropStreet','inpSelfOccPropArea','inpSelfOccPropCity','inpSelfOccPropPincode','uploadHouseIncomeProofFlag')}
    );

    this.rentalPropIncomeForm = this.formBuilder.group({
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
      inpRenCOShare:[''],

      uploadRentalPropDocs: [''],
      uploadRentalPropDocsPwd: [''],
      uploadRentalIncomeProofFlag:[''],
    },{validator: this.makeRentalFileUploadMandatory('inpRentalPropFlatNo','inpRentalPropPremise','inpRentalPropStreet','inpRentalPropArea','inpRentalPropCity','inpRenPropPincode','uploadRentalIncomeProofFlag')}
    );

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

    this.autoFillSalaryIncomeForm();

    //File Uploader with form data
    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };

    this.uploader.onBuildItemForm = (fileItem: any, form: any) => { 
      form.append('UserId', this.userId);
      form.append('ApplicationId', this.ApplicationId);
      if(this.step1 == true)
      {
        form.append('DocCategory', 'Form16');
        form.append('FilePassword', this.salaryIncomeForm.get('uploadFilePassword').value);
      }
      if(this.step2 == true)
      {
        form.append('DocCategory', 'OtherIncome');
        form.append('FilePassword', this.otherIncomeForm.get('uploadOtherIncomeFilePwd').value);
      }
      if(this.step3 == true)
      {
        form.append('DocCategory', 'HousePropIncome');
        form.append('FilePassword', this.housePropIncomeForm.get('uploadHousePropDocsPwd').value);
      }
      if(this.step4 == true)
      {
        form.append('DocCategory', 'RentalPropIncome');
        form.append('FilePassword', this.rentalPropIncomeForm.get('uploadRentalPropDocsPwd').value);
      }
      if(this.step5 == true)
      {
        form.append('DocCategory', 'CapitalsIncome');
      }
      
    };

    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
          console.log('ImageUpload:uploaded:', item, status, response);
          console.log('Response '+ response); 
          var res = JSON.parse(response);
          //alert('File uploaded successfully');
          if(res['statusCode'] == 200){                 
            this.alertService.success('File Uploaded successfully');
            if(this.step1 == true)
            {
              this.salaryIncomeForm.get('uploadForm16FileFlag').setValue('1');
            }
            if(this.step2 == true)
            {
              this.otherIncomeForm.get('uploadOtherIncomeProofFlag').setValue('1');
            }
            if(this.step3 == true)
            {
              this.housePropIncomeForm.get('uploadHouseIncomeProofFlag').setValue('1');
            }
            if(this.step4 == true)
            {
              this.rentalPropIncomeForm.get('uploadRentalIncomeProofFlag').setValue('1');
            }
            if(this.step5 == true)
            {
              this.captialIncomeForm.get('uploadShareIncomeProofFlag').setValue('1');
            }

          }else{
            this.alertService.error('File Uploading Failed');
          }
    };
    /*File Uploader with form data ends here */
  }

  ngAfterViewInit(){
    handleInsideHeaderBackground();
    handleFloatingLabels(Waves);
	}

  get s() { return this.salaryIncomeForm.controls; }
  get o() { return this.otherIncomeForm.controls; }
  get h() { return this.housePropIncomeForm.controls; }
  get r() { return this.rentalPropIncomeForm.controls; }
  get c() { return this.captialIncomeForm.controls; }

  //validation to check passwords match or not
  private makeFileUploadMandatory(inputSavingsIncome: string,inputFDInterestIncome:string,inputAnyOtherIncome:string,inputSharesIncome:string,inputExemptIncome:string,inputOtherExemptIncome:string,inputAgriIncome:string,inputDepAmount:string,inputPFIncome:string,uploadOtherIncomeProofFlag:string) {
    return (group: FormGroup) => {
      const savingsIncomeInput = group.controls[inputSavingsIncome];
      const fdIncomeInput = group.controls[inputFDInterestIncome];
      const otherIncomeInput = group.controls[inputAnyOtherIncome];
      const shareIncomeInput = group.controls[inputSharesIncome];
      const exemptIncomeInput = group.controls[inputExemptIncome];
      const otherExmptIncomeInput = group.controls[inputOtherExemptIncome];
      const agriIncomeInput = group.controls[inputAgriIncome];
      const depIncomeInput = group.controls[inputDepAmount];
      const pfIncomeInput = group.controls[inputPFIncome];
      const upOthIncPrFlgInput = group.controls[uploadOtherIncomeProofFlag];
      
      if (upOthIncPrFlgInput.errors && !upOthIncPrFlgInput.errors.required) {
        // return if another validator has already found an error on the matchingControl
        return;
      }
      
      if((savingsIncomeInput.value != "" || fdIncomeInput.value != "" || otherIncomeInput.value != "" || shareIncomeInput.value != "" || exemptIncomeInput.value != "" || otherExmptIncomeInput.value != "" || agriIncomeInput.value != "" || depIncomeInput.value != "" || pfIncomeInput.value != "") && upOthIncPrFlgInput.value != '1'){
          return upOthIncPrFlgInput.setErrors({required: true});
      } else {
          return upOthIncPrFlgInput.setErrors(null);
      }
    };
  }

  //validation to check passwords match or not
  private makeHouseFileUploadMandatory(inpSelfOccPropFlatNo : string,inpSelfOccPropPremise : string,inpSelfOccPropStreet: string,inpSelfOccPropArea: string,inpSelfOccPropCity: string,inpSelfOccPropPincode: string,uploadHouseIncomeProofFlag:string) {
    return (group: FormGroup) => {
      const flatnoInput = group.controls[inpSelfOccPropFlatNo];
      const premiseInput = group.controls[inpSelfOccPropPremise];
      const streetInput = group.controls[inpSelfOccPropStreet];
      const areaInput = group.controls[inpSelfOccPropArea];
      const cityInput = group.controls[inpSelfOccPropCity];
      const pincodeInput = group.controls[inpSelfOccPropPincode];
      const upHseIncPropFlgInput = group.controls[uploadHouseIncomeProofFlag];
      
      if (upHseIncPropFlgInput.errors && !upHseIncPropFlgInput.errors.required) {
        // return if another validator has already found an error on the matchingControl
        return;
      }
      
      if((flatnoInput.value != "" || premiseInput.value != "" || streetInput.value != "" || areaInput.value != "" || cityInput.value != "" || pincodeInput.value != "") && upHseIncPropFlgInput.value != '1'){
          return upHseIncPropFlgInput.setErrors({required: true});
      } else {
          return upHseIncPropFlgInput.setErrors(null);
      }
    };
  }

  //validation to check passwords match or not
  private makeRentalFileUploadMandatory(inpRentalPropFlatNo : string,inpRentalPropPremise : string,inpRentalPropStreet: string,inpRentalPropArea: string,inpRentalPropCity: string,inpRenPropPincode: string,uploadRentalIncomeProofFlag:string) {
    return (group: FormGroup) => {
      const flatnoInput = group.controls[inpRentalPropFlatNo];
      const premiseInput = group.controls[inpRentalPropPremise];
      const streetInput = group.controls[inpRentalPropStreet];
      const areaInput = group.controls[inpRentalPropArea];
      const cityInput = group.controls[inpRentalPropCity];
      const pincodeInput = group.controls[inpRenPropPincode];
      const upHseIncPropFlgInput = group.controls[uploadRentalIncomeProofFlag];
      
      if (upHseIncPropFlgInput.errors && !upHseIncPropFlgInput.errors.required) {
        // return if another validator has already found an error on the matchingControl
        return;
      }
      
      if((flatnoInput.value != "" || premiseInput.value != "" || streetInput.value != "" || areaInput.value != "" || cityInput.value != "" || pincodeInput.value != "") && upHseIncPropFlgInput.value != '1'){
          return upHseIncPropFlgInput.setErrors({required: true});
      } else {
          return upHseIncPropFlgInput.setErrors(null);
      }
    };
  }

  autoFillSalaryIncomeForm(){
    //this.salaryIncomeForm.get('uploadForm16FileFlag').setValue("1");
  }

  autoFillOtherIncomeForm(){
    //this.otherIncomeForm.get('uploadOtherIncomeProofFlag').setValue("1");
  }

  autoFillHouseIncomeForm(){
    //this.housePropIncomeForm.get('uploadHouseIncomeProofFlag').setValue("1");
  }

  autoFillRentalIncomeForm(){
    //this.rentalPropIncomeForm.get('uploadRentalIncomeProofFlag').setValue("1");
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
        //this.alertService.error('Please enter all fields in all tabs');
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
        this.alertService.error('Please enter all fields in both tabs');
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
        this.alertService.error('Please enter all fields in both tabs');
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
        this.alertService.error('Please enter all fields in both tabs');
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
        this.alertService.error('Please enter all fields in both tabs');
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
              "uploadDocFlag":this.s.uploadForm16FileFlag.value,
              "employernm":this.s.inputEmployernm.value,
              "employertype":this.s.inputEmployertype.value,
              "salamount":this.s.inputSalary.value
            };
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
            "uploadDocFlag":this.o.uploadOtherIncomeProofFlag.value,
            "savingsIncome":this.o.inputSavingsIncome.value,
            "fdincome":this.o.inputFDInterestIncome.value,
            "othericnome":this.o.inputAnyOtherIncome.value,
            "shareincome":this.o.inputSharesIncome.value,
            "exemptincome":this.o.inputExemptIncome.value,
            "otherexemptincome":this.o.inputOtherExemptIncome.value,
            "agriincome":this.o.inputAgriIncome.value,
            "agriexpend":this.o.inputAgriExpend.value,
            "agriloss":this.o.inputAgriLoss.value,
            "depincome":this.o.inputDepAmount.value,
            "depname":this.o.inputDepPersonName.value,
            "deprelation":this.o.inputDepPersonRel.value,
            "depincomeNature":this.o.inputDepIncomeNature.value,
            "pfincome":this.o.inputPFIncome.value,
            "pfincometax":this.o.inputPFIncomeTax.value
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
                      this.alertService.success('Application - Other Income data saved successfully');
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
              this.alertService.error('Application - Other Income data save request failed '+error);
              this.loading = false;
          });
        break;
        case "houseIncomeDetails":
          houseIncomeInputParam = {
            'appId':this.ApplicationId,
            'userId':this.userId,
            "uploadDocFlag":this.h.uploadHouseIncomeProofFlag.value,
            "flatno":this.h.inpSelfOccPropFlatNo.value,
            "premises":this.h.inpSelfOccPropPremise.value,
            "street":this.h.inpSelfOccPropStreet.value,
            "area":this.h.inpSelfOccPropArea.value,
            "city":this.h.inpSelfOccPropCity.value,
            "pincode":this.h.inpSelfOccPropPincode.value,
            "country":this.h.inpSelfOccPropCountry.value,
            "state":this.h.inpSelfOccPropState.value,

            "proploanflag":this.h.inpSelfOccPropLoanFlag.value,
            "propinterestpaid":this.h.inpSelfOccPropInterset.value,

            "coflag":this.h.inpCOFlag.value,
            "selfshare":this.h.inpSelfShare.value,
            "coname":this.h.inpCOName.value,
            "copan":this.h.inpCOPan.value,
            "coshare":this.h.inpCOShare.value
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
            "uploadDocFlag":this.r.uploadRentalIncomeProofFlag.value,

            "flatno":this.r.inpRentalPropFlatNo.value,
            "premises":this.r.inpRentalPropPremise.value,
            "street":this.r.inpRentalPropStreet.value,
            "area":this.r.inpRentalPropArea.value,
            "city":this.r.inpRentalPropCity.value,
            "pincode":this.r.inpRentalPropPincode.value,
            "country":this.r.inpRentalPropCountry.value,
            "state":this.r.inpRentalPropState.value,

            "rentAmountRcvd":this.r.inpRentalPropRentRec.value,
            "rentHouseTaxPaid":this.r.inpRentalPropHousetax.value,
            "rentalTenantNm":this.r.inpRentalPropTenName.value,
            "rentalTenantPan":this.r.inpRentalPropTenPan.value,
            
            "rentalPropLoanFlag":this.r.inpRentalPropLoanFlag.value,
            "rentalpropInterestPaid":this.r.inpRentalPropInterset.value,

            "coflag":this.r.inpRenCOFlag.value,
            "selfshare":this.r.inpRenSelfShare.value,
            "unRealizedRent":this.r.inpRenUnRealRent.value,
            "coname":this.r.inpRenCOName.value,
            "copan":this.r.inpRenCOPan.value,
            "coshare":this.r.inpRenCOShare.value
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
