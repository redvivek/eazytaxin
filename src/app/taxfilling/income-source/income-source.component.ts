import { Component, OnInit,AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { environment } from '@environments/environment';
import { handleInsideHeaderBackground,handleFloatingLabels,formSticky,getFileSizeNameAndType } from '../../app.helpers';
import { AuthenticationService,ApplicationService, AlertService } from '@app/_services';
import * as Waves from 'node-waves';

const URL = `${environment.apiUrl}/tax/uploadproofDocuments`;

@Component({
  selector: 'app-income-source',
  templateUrl: './income-source.component.html',
  styleUrls: ['./income-source.component.css']
})
export class IncomeSourceComponent implements OnInit,AfterViewInit {
  //Initialize all sub forms
  salaryIncomeUploadForm : FormGroup;
  salaryIncomeForm: FormGroup;
  otherIncomeForm: FormGroup;
  otherIncomeUploadForm: FormGroup;
  housePropIncomeForm: FormGroup;
  housePropIncomeUploadForm: FormGroup;
  rentalPropIncomeForm: FormGroup;
  rentalPropIncomeUploadForm: FormGroup;
  captialIncomeForm: FormGroup;
  captialIncomeUploadForm: FormGroup;

  loading = false;

  //flag to check submitted event on each subform
  salFSubmitted = false;
  salUFSubmitted = false;
  othFSubmitted = false;
  othUFSubmitted = false;
  houFSubmitted = false;
  houUFSubmitted = false;
  renFSubmitted = false;
  renUFSubmitted = false;
  capFSubmitted = false;
  capUFSubmitted = false;

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
  //initilize & activate flag to by default active rentalIncome subtab
  step5_captial_upload :boolean = false;
  step5_captial_data :boolean = true;
  
  //Global variables to save userdId and ApplictionID
  userId : number;
  ApplicationId : number;
  nextButtonDisable = false;
  previousButtonDisable = false;
  selAssYear : any = null;

  //Create list of assesment year
  taxperiods = this.getCurrentAssesmentYear();

  //Read localstorage in progress application values
  localStoreg = JSON.parse(localStorage.getItem("currentUserApp"));


  constructor( 
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private appService : ApplicationService,
    private alertService : AlertService
  ) 
  {
    // redirect to login if not logged in
    if (!this.authenticationService.currentUserValue) { 
      this.router.navigate(['/login']);
    }else{
      //console.log("Current user value "+ JSON.stringify(this.authenticationService.currentUserValue));
      //console.log("Current App value "+ this.appService.currentApplicationValue);
      this.userId         = this.authenticationService.currentUserValue.userid;
      if(this.appService.currentApplicationValue != null){
        this.ApplicationId  = this.appService.currentApplicationValue.appId;
        this.selAssYear     = this.appService.currentApplicationValue.taxperiod;
      }else{
        this.nextButtonDisable = true;
        this.previousButtonDisable = true;
      }
    }
  }

  public uploader: FileUploader = new FileUploader({
    url: URL, 
    itemAlias: 'uploadIncomeProofs'
  });

  public otheruploader : FileUploader = new FileUploader({
    url: URL, 
    itemAlias: 'uploadOtherIncomeProofs'
  });

  public houseuploader : FileUploader = new FileUploader({
    url: URL, 
    itemAlias: 'uploadHouseIncomeProofs'
  });

  public rentaluploader : FileUploader = new FileUploader({
    url: URL, 
    itemAlias: 'uploadRentalIncomeProofs'
  });

  public shareuploader : FileUploader = new FileUploader({
    url: URL, 
    itemAlias: 'uploadShareIncomeProofs'
  });
  
  ngOnInit() {
    this.salaryIncomeUploadForm = this.formBuilder.group({
      uploadForm16File: [''],
      uploadFilePassword: [''],
      uploadForm16FileFlag:['0']
    });

    this.salaryIncomeForm = this.formBuilder.group({
      inputEmployernm:['', 
        [
          Validators.required,
          Validators.maxLength(125),
          Validators.pattern('^[a-zA-Z ]*$')
        ],
      ],
      inputEmployertype:['',
        [
          Validators.required
        ],
      ],
      inputSalary: ['', 
        [
          Validators.required,
          Validators.pattern("^[0-9]+(.[0-9]{0,2})?$")
        ],
      ],
      inputEmpTAN:['',
        [
          Validators.required,
          Validators.maxLength(10),
          Validators.pattern("^([A-Z]{4}[0-9]{5}[A-Z])*$")
        ],
      ],
      inputAllowances: ['', 
        [
          Validators.pattern("^[0-9]+(.[0-9]{0,2})?$")
        ],
      ],
      valPrequisties: ['', 
        [
          Validators.pattern("^[0-9]+(.[0-9]{0,2})?$")
        ],
      ],
      inputSalProfits: ['', 
        [
          Validators.pattern("^[0-9]+(.[0-9]{0,2})?$")
        ],
      ],
      deductionEnter: ['', 
        [
          Validators.pattern("^[0-9]+(.[0-9]{0,2})?$")
        ],
      ],
      inputLTAAmount: ['', 
        [
          Validators.pattern("^[0-9]+(.[0-9]{0,2})?$")
        ],
      ],
      nonMoneyPrequisties: ['', 
        [
          Validators.pattern("^[0-9]+(.[0-9]{0,2})?$")
        ],
      ],
      expAllowanceHR: ['', 
        [
          Validators.pattern("^[0-9]+(.[0-9]{0,2})?$")
        ],
      ],
      othAllowance: ['', 
        [
          Validators.pattern("^[0-9]+(.[0-9]{0,2})?$")
        ],
      ]
    });

    this.otherIncomeForm = this.formBuilder.group({
      inputSavingsIncome:['', [Validators.pattern("^[0-9]+(.[0-9]{0,2})?$")],],
      inputFDInterestIncome: ['', [Validators.pattern("^[0-9]+(.[0-9]{0,2})?$")],],
      inputRefundIntIncome: ['', [Validators.pattern("^[0-9]+(.[0-9]{0,2})?$")],],
      inputOthInterestIncome: ['', [Validators.pattern("^[0-9]+(.[0-9]{0,2})?$")],],
      inputAnyOtherIncome: ['', [Validators.pattern("^[0-9]+(.[0-9]{0,2})?$")],],
      inputSharesIncome: ['', [Validators.pattern("^[0-9]+(.[0-9]{0,2})?$")],],
      inputExemptIncome: ['' , [Validators.pattern("^[0-9]+(.[0-9]{0,2})?$")],],
      inputOtherExemptIncome: ['' , [Validators.pattern("^[0-9]+(.[0-9]{0,2})?$")],],
      inputAgriIncome:['', [Validators.pattern("^[0-9]+(.[0-9]{0,2})?$")],],
      inputAgriExpend:['', [Validators.pattern("^[0-9]+(.[0-9]{0,2})?$")],],
      inputAgriLoss: ['', [Validators.pattern("^[0-9]+(.[0-9]{0,2})?$")],],
      inputDepAmount: ['' , [Validators.pattern("^[0-9]+(.[0-9]{0,2})?$")],],
      inputDepPersonName: ['' , [Validators.pattern('^[a-zA-Z ]*$')],],
      inputDepPersonRel:[''],
      inputDepIncomeNature:[''],
      taxperiod :[''],
      inputPFIncome: ['' , [Validators.pattern("^[0-9]+(.[0-9]{0,2})?$")],],
      inputPFTax:['', [Validators.pattern("^[0-9]+(.[0-9]{0,2})?$")],]
    });

    this.otherIncomeUploadForm = this.formBuilder.group({
      uploadOtherIncomeProofFile: [''],
      uploadOtherIncomeFilePwd: [''],
      uploadOtherIncomeProofFlag:['0']
    });

    this.housePropIncomeForm = this.formBuilder.group({
      inpSelfOccPropFlatNo: ['',[Validators.maxLength(50)], ],
      inpSelfOccPropPremise : ['',[Validators.maxLength(50)],],
      inpSelfOccPropStreet: ['',[Validators.maxLength(50)],],
      inpSelfOccPropArea: ['',[Validators.maxLength(50)], ],
      inpSelfOccPropCity: ['',[Validators.maxLength(50)], ],
      inpSelfOccPropPincode:['',
        [
          Validators.maxLength(6),
          Validators.pattern("^([1-9]{1}[0-9]{5})*$")
        ],
      ],
      inpSelfOccPropCountry:[''],
      inpSelfOccPropState:[''],
      
      inpSelfOccPropLoanFlag: [''],
      inpSelfOccPropInterset: ['',
        [
          //Validators.pattern("^[0-9]+(.[0-9]{0,2})?$")
          Validators.pattern("^[0-9]*$"),
        ],
      ],
      
      inpCOFlag: ['' ],
      inpSelfShare:['',
        [
          Validators.pattern("^[0-9]*$"),
        ],
      ],
      inpCOName:['',
        [
          Validators.maxLength(125),
          Validators.pattern('^[a-zA-Z ]*$')
        ],
      ],
      inpCOPan: ['',
        [
          Validators.maxLength(10),
          Validators.pattern("^([A-Z]{3}[P][A-Z][0-9]{4}[A-Z])*$"), 
        ],
      ],
      inpCOShare:['',[Validators.pattern("^[0-9]*$"),],]
    });

    this.housePropIncomeUploadForm = this.formBuilder.group({
      uploadHousePropDocs: [''],
      uploadHousePropDocsPwd: [''],
      uploadHouseIncomeProofFlag:['0']
    });

    this.rentalPropIncomeForm = this.formBuilder.group({
      inpRentalPropFlatNo: ['' ,[Validators.maxLength(50)],],
      inpRentalPropPremise : ['',[Validators.maxLength(50)],],
      inpRentalPropStreet: ['',[Validators.maxLength(50)],],
      inpRentalPropArea: ['' ,[Validators.maxLength(50)],],
      inpRentalPropCity: ['' ,[Validators.maxLength(50)],],
      inpRenPropPincode : ['',
        [
          Validators.maxLength(6),
          Validators.pattern("^([1-9]{1}[0-9]{5})*$")
        ],
      ],
      inpRentalPropCountry:[''],
      inpRentalPropState:[''],
      
      inpRentalPropRentRec : ['',
        [ 
          Validators.pattern("^[0-9]+(.[0-9]{0,2})?$")
        ],
      ],
      inpRentalPropHousetax : ['',
        [ 
          Validators.pattern("^[0-9]+(.[0-9]{0,2})?$")
        ],
      ],
      inpRentalPropTenName:['',
        [
          Validators.maxLength(125),
          Validators.pattern('^[a-zA-Z ]*$')
        ]
      ],
      inpRentalPropTenPan:['',
        [
          Validators.maxLength(10),
          Validators.pattern("^([A-Z]{3}[P][A-Z][0-9]{4}[A-Z])*$"), 
        ],
      ],
      
      inpRentalPropLoanFlag: [''],
      inpRentalPropInterset: ['',
        [ 
          Validators.pattern("^[0-9]+(.[0-9]{0,2})?$")
        ],
      ],

      inpRenCOFlag: ['' ],
      inpRenUnRealRent:['',
        [
          Validators.pattern("^[0-9]*$")
        ],
      ],
      inpRenSelfShare:['',
        [
          Validators.pattern("^[0-9]*$"),
        ],
      ],
      inpRenCOName:['',
        [
          Validators.maxLength(125),
          Validators.pattern('^[a-zA-Z ]*$')
        ],
      ],
      inpRenCOPan: ['',
        [
          Validators.maxLength(10),
          Validators.pattern("^([A-Z]{3}[P][A-Z][0-9]{4}[A-Z])*$"), 
        ],
      ],
      inpRenCOShare:['',[Validators.pattern("^[0-9]*$")],]
    });

    this.rentalPropIncomeUploadForm = this.formBuilder.group({
      uploadRentalPropDocs: [''],
      uploadRentalPropDocsPwd: [''],
      uploadRentalIncomeProofFlag:['0'],
    });

    this.captialIncomeForm = this.formBuilder.group({
      inpSaleType: [''],
      inputSalesProceed: [''],
      inputSalesDate: ['' ],
      inpSTTPaid : [''],
      inputCostBasis: ['' ],
      inputPurDate : ['']
    });

    this.captialIncomeUploadForm = this.formBuilder.group({
      uploadShareIncomeProof: ['']
      //uploadShareIncomeProofFlag: ['0']
    });

    this.autoFillSalaryIncomeForm();

    //File Uploader with form data
    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };

    this.uploader.onBuildItemForm = (fileItem: any, form: any) => { 
      form.append('UserId', this.userId);
      form.append('ApplicationId', this.ApplicationId);
      form.append('DocCategory', 'Form16');
      form.append('FilePassword', this.salaryIncomeUploadForm.get('uploadFilePassword').value);
    };

    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
          //console.log('ImageUpload:uploaded:', item, status, response);
          //console.log('Response '+ response); 
          var res = JSON.parse(response);
          //alert('File uploaded successfully');
          if(res['statusCode'] == 200){                 
            this.alertService.success('File Uploaded successfully');
            this.salaryIncomeUploadForm.get('uploadForm16FileFlag').setValue('1');
          }else{
            this.alertService.error('File Uploading Failed');
          }
    };

    //File Uploader with form data
    this.otheruploader.onAfterAddingFile = (file) => { file.withCredentials = false; };

    this.otheruploader.onBuildItemForm = (fileItem: any, form: any) => { 
      form.append('UserId', this.userId);
      form.append('ApplicationId', this.ApplicationId);
      form.append('DocCategory', 'OtherIncome');
      form.append('FilePassword', this.otherIncomeUploadForm.get('uploadOtherIncomeFilePwd').value);
    };

    this.otheruploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
          //console.log('ImageUpload:uploaded:', item, status, response);
          //console.log('Response '+ response); 
          var res = JSON.parse(response);
          //alert('File uploaded successfully');
          if(res['statusCode'] == 200){                 
            this.alertService.success('File Uploaded successfully');
            this.otherIncomeUploadForm.get('uploadOtherIncomeProofFlag').setValue('1');
          }else{
            this.alertService.error('File Uploading Failed');
          }
    };

    //File Uploader with form data
    this.houseuploader.onAfterAddingFile = (file) => { file.withCredentials = false; };

    this.houseuploader.onBuildItemForm = (fileItem: any, form: any) => { 
      form.append('UserId', this.userId);
      form.append('ApplicationId', this.ApplicationId);
      form.append('DocCategory', 'HousePropIncome');
      form.append('FilePassword', this.housePropIncomeUploadForm.get('uploadHousePropDocsPwd').value);
    };

    this.houseuploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
          //console.log('ImageUpload:uploaded:', item, status, response);
          //console.log('Response '+ response); 
          var res = JSON.parse(response);
          //alert('File uploaded successfully');
          if(res['statusCode'] == 200){                 
            this.alertService.success('File Uploaded successfully');
            this.housePropIncomeUploadForm.get('uploadHouseIncomeProofFlag').setValue('1');
          }else{
            this.alertService.error('File Uploading Failed');
          }
    };

    //File Uploader with form data
    this.rentaluploader.onAfterAddingFile = (file) => { file.withCredentials = false; };

    this.rentaluploader.onBuildItemForm = (fileItem: any, form: any) => { 
      form.append('UserId', this.userId);
      form.append('ApplicationId', this.ApplicationId);
      form.append('DocCategory', 'RentalPropIncome');
      form.append('FilePassword', this.rentalPropIncomeUploadForm.get('uploadRentalPropDocsPwd').value);
    };

    this.rentaluploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
          //console.log('ImageUpload:uploaded:', item, status, response);
          //console.log('Response '+ response); 
          var res = JSON.parse(response);
          //alert('File uploaded successfully');
          if(res['statusCode'] == 200){                 
            this.alertService.success('File Uploaded successfully');
            this.rentalPropIncomeUploadForm.get('uploadRentalIncomeProofFlag').setValue('1');
          }else{
            this.alertService.error('File Uploading Failed');
          }
    };

    this.shareuploader.onAfterAddingFile = (file) => { file.withCredentials = false; };

    this.shareuploader.onBuildItemForm = (fileItem: any, form: any) => { 
      form.append('UserId', this.userId);
      form.append('ApplicationId', this.ApplicationId);
      form.append('DocCategory', 'CapitalsShareIncome');
    };

    this.shareuploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      //console.log('ImageUpload:uploaded:', item, status, response);
      //console.log('Response '+ response); 
      var res = JSON.parse(response);
      //alert('File uploaded successfully');
      if(res['statusCode'] == 200){                 
        this.alertService.success('File Uploaded successfully');
        //this.captialIncomeUploadForm.get('uploadShareIncomeProofFlag').setValue('1');
      }else{
        this.alertService.error('File Uploading Failed');
      }
};
    /*File Uploader with form data ends here */
  }

  ngAfterViewInit(){
    handleInsideHeaderBackground();
    handleFloatingLabels(Waves);
    formSticky();
    getFileSizeNameAndType();
	}

  get su() { return this.salaryIncomeUploadForm.controls; }
  get s() { return this.salaryIncomeForm.controls; }
  get o() { return this.otherIncomeForm.controls; }
  get ou() { return this.otherIncomeUploadForm.controls; }
  get h() { return this.housePropIncomeForm.controls; }
  get hu() { return this.housePropIncomeUploadForm.controls; }
  get r() { return this.rentalPropIncomeForm.controls; }
  get ru() { return this.rentalPropIncomeUploadForm.controls; }
  get c() { return this.captialIncomeForm.controls; }
  get cu() { return this.captialIncomeUploadForm.controls; }

  onAddressCheck(type,event):void{
    const targetChkBox = event.target;
    var inputflatno,inputPremnm,inputStreetnm,inputArea,inputCity,inputState,inputPincode,inputCountry;
    //console.log("Checkbox event & value " +targetChkBox.checked+" - "+targetChkBox.value+"-"+type);
    if(type == "self"){
      inputflatno = this.housePropIncomeForm.get('inpSelfOccPropFlatNo');
      inputPremnm = this.housePropIncomeForm.get('inpSelfOccPropPremise');
      inputStreetnm = this.housePropIncomeForm.get('inpSelfOccPropStreet');
      inputArea = this.housePropIncomeForm.get('inpSelfOccPropArea');
      inputCity = this.housePropIncomeForm.get('inpSelfOccPropCity');
      inputState = this.housePropIncomeForm.get('inpSelfOccPropState');
      inputPincode = this.housePropIncomeForm.get('inpSelfOccPropPincode');
      inputCountry = this.housePropIncomeForm.get('inpSelfOccPropCountry');
    }else{
      inputflatno = this.rentalPropIncomeForm.get('inpRentalPropFlatNo');
      inputPremnm = this.rentalPropIncomeForm.get('inpRentalPropPremise');
      inputStreetnm = this.rentalPropIncomeForm.get('inpRentalPropStreet');
      inputArea = this.rentalPropIncomeForm.get('inpRentalPropArea');
      inputCity = this.rentalPropIncomeForm.get('inpRentalPropCity');
      inputState = this.rentalPropIncomeForm.get('inpRentalPropState');
      inputPincode = this.rentalPropIncomeForm.get('inpRenPropPincode');
      inputCountry = this.rentalPropIncomeForm.get('inpRentalPropCountry');
    }
    if (targetChkBox.checked) {
      this.appService.getAddressInfoByAppId(this.ApplicationId,'Residence')
      .pipe(first())
      .subscribe(
          data  => {
            //console.log("Response"+JSON.stringify(data));
            if(data != null){
                //console.log("Existing perInfo "+ JSON.stringify(data));
                //Preload form with existing or default values
                inputflatno.setValue(data.Flatno_Blockno);
                inputPremnm.setValue(data.Building_Village_Premises);
                inputStreetnm.setValue(data.Road_Street_PO);
                inputArea.setValue(data.Area_Locality);
                inputPincode.setValue(data.Pincode);
                inputCity.setValue(data.City_Town_District);
                inputState.setValue(data.State);
                inputCountry.setValue(data.Country);
                handleFloatingLabels(Waves);
              }else{
                inputflatno.setValue('');
                inputPremnm.setValue('');
                inputStreetnm.setValue('');
                inputArea.setValue('');
                inputPincode.setValue('');
                inputCity.setValue('');
                inputState.setValue('');
                inputCountry.setValue('');
                handleFloatingLabels(Waves);
              }
        },
        error => {
            console.log("AppMain fetch data error"+JSON.stringify(error));
            //this.loading = false;
            //return error;
        });
    }else{
      inputflatno.setValue('');
      inputPremnm.setValue('');
      inputStreetnm.setValue('');
      inputArea.setValue('');
      inputPincode.setValue('');
      inputCity.setValue('');
      inputState.setValue('');
      inputCountry.setValue('');
    }
  }

  disbaleLoanAmount(event):void{
    const targetvalue= event.target.value;
    let control = this.housePropIncomeForm.get('inpSelfOccPropInterset');
    //console.log("slect event & value " +targetvalue);
    if(targetvalue == 1){
      control.enable();
      control.setValidators([Validators.required]);
    }else{
      control.disable();
      control.clearValidators();
    }
    control.updateValueAndValidity();
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
    //this.captialIncomeUploadForm.get('uploadShareIncomeProofFlag').setValue("0");
  }

  //Function Called on next button click
  on_next_click(a){
    switch(a){
      case "step1_income_salary_upload":
        this.salUFSubmitted = true;
        console.log("Salary Income Upload details submitted");
        this.step1 = true;
        this.step1_income_salary_upload = false;
        this.step1_income_from_salary = true;
        this.step2 = false;
        this.step3 = false;
        this.step4 = false;
        this.step5 = false;
      break;

      case "step1_income_from_salary":
        this.salFSubmitted = true;
        this.loading = true;
        console.log("Salary Income details submitted");
        // stop here if form is invalid
        if (this.salaryIncomeForm.invalid) {
          this.alertService.error('Please enter all fields in both tabs');
          this.loading = false;
          return;
        }else{
          this.onSubmit(this.salaryIncomeForm,'salIncomeDetails');
        }
      break;

      case "step2_income_other_data":
        this.othFSubmitted = true;
        this.loading = true;
        console.log("Other Income details submitted");
        // stop here if form is invalid
        if (this.otherIncomeForm.invalid) {
          this.alertService.error('Please enter all fields in both tabs');
          this.loading = false;
          return;
        }else{
          this.onSubmit(this.otherIncomeForm,'otherIncomeDetails');
        }
      break;

      case "step2_income_other_upload":
        this.othUFSubmitted = true;
        console.log("Other Income Upload details submitted");
        this.step1 = false;
        this.step1_income_salary_upload = false;
        this.step1_income_from_salary = false;
        this.step2 = false;
        this.step2_income_other_data = false;
        this.step2_income_other_upload = false;
        this.step3 = true;
        this.step3_house_property_data = true;
        this.step3_house_property_upload = false; 
        this.step4 = false;
        this.step5 = false;
        
      break;

      case "step3_house_property_data":
        this.houFSubmitted = true;
        this.loading = true;
        console.log("House Prop details submitted");
        if (this.housePropIncomeForm.invalid) {
          this.alertService.error('Please enter all fields in both tabs');
          this.loading = false;
          return;
        }else{
          this.onSubmit(this.housePropIncomeForm,'houseIncomeDetails');
        }
      break;

      case "step3_house_property_upload":
        this.houUFSubmitted = true;
        this.loading = true;
        console.log("House Prop Upload details submitted");
        this.step1 = false;
        this.step1_income_salary_upload = false;
        this.step1_income_from_salary = false;
        this.step2 = false;
        this.step2_income_other_data = false;
        this.step2_income_other_upload = false;
        this.step3 = false;
        this.step3_house_property_data = false;
        this.step3_house_property_upload = false; 
        this.step4 = true;
        this.step4_rental_property_data = true;
        this.step4_rental_property_upload = false;
        this.step5 = false;
      break;

      case "step4_rental_property_data":
        this.renFSubmitted = true;
        this.loading = true;
        console.log("Rental property details submitted");
        if (this.rentalPropIncomeForm.invalid) {
          this.alertService.error('Please enter all fields in both tabs');
          this.loading = false;
          return;
        }else{
          this.onSubmit(this.rentalPropIncomeForm,'renIncomeDetails');
        }
      break;

      case "step4_rental_property_upload":
        this.renUFSubmitted = true;
        this.loading = true;
        console.log("Rental property Upload details submitted");
        this.step1 = false;
        this.step1_income_salary_upload = false;
        this.step1_income_from_salary = false;
        this.step2 = false;
        this.step2_income_other_data = false;
        this.step2_income_other_upload = false;
        this.step3 = false;
        this.step3_house_property_data = false;
        this.step3_house_property_upload = false; 
        this.step4 = false;
        this.step4_rental_property_data = false;
        this.step4_rental_property_upload = false;
        this.step5 = true;
        this.step5_captial_data = true;
        this.step5_captial_upload = false;
      break;

      case "step5_captial_data":
        this.capFSubmitted = true;
        this.loading = true;
        console.log("Capital Income submitted");
        if (this.captialIncomeForm.invalid) {
          this.alertService.error('Please enter all fields in all tabs');
          this.loading = false;
          return;
        }else{
          this.onSubmit(this.captialIncomeForm,'capIncomeDetails');
        }
      break;

      case "step5_captial_upload":
        this.capUFSubmitted = true;
        this.loading = true;
        console.log("Capital Income Upload submitted");
        this.router.navigate(['taxfilling/deductions']);
      break;
    }
  }


  onSubmit(formname,infoType) {
    var salIncomeInputParam,othIncomeInputParam,houseIncomeInputParam,rentIncomeInputParam,capIncomeInputParam;  
    console.log('Input values!! :-)\n\n' + JSON.stringify(formname.value));
      switch(infoType){
        case "salIncomeDetails":
          salIncomeInputParam = {
              'appId':this.ApplicationId,
              'userId':this.userId,
              "employernm":this.s.inputEmployernm.value,
              "employertype":this.s.inputEmployertype.value,
              "salamount":this.s.inputSalary.value,
              "employerTan":this.s.inputEmpTAN.value,
              "allowances":this.s.inputAllowances.value,
              "valPrequisties":this.s.valPrequisties.value,
              "inputSalProfits":this.s.inputSalProfits.value,
              "deductionEnter":this.s.deductionEnter.value,
              "inputLTAAmount":this.s.inputLTAAmount.value,
              "nonMoneyPrequisties":this.s.nonMoneyPrequisties.value,
              "expAllowanceHR":this.s.expAllowanceHR.value,
              "othAllowance":this.s.othAllowance.value
            };
            // start storing application data in database
            this.appService.saveSalIncomeDetails(salIncomeInputParam)
            .pipe(first())
            .subscribe(
              data => { 
                      //console.log("Response" + JSON.stringify(data));
                      //successfully inserted
                      if(data['statusCode'] == 200){                  
                          this.alertService.success('Application - Salary Income data saved successfully');
                          this.localStoreg['applicationStage'] = 9;
                          //console.log("LocalStore" + JSON.stringify(this.localStoreg));
                          localStorage.removeItem("currentUserApp");
                          localStorage.setItem("currentUserApp", JSON.stringify(this.localStoreg));
                          this.loading = false;
                          this.step1 = false;
                          this.step1_income_salary_upload = false;
                          this.step1_income_from_salary = false;
                          this.step2 = true;
                          this.step2_income_other_data = true;
                          this.step2_income_other_upload = false;
                          this.step3 = false;
                          this.step4 = false;
                          this.step5 = false;
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
            "savingsIncome":this.o.inputSavingsIncome.value,
            "fdincome":this.o.inputFDInterestIncome.value,
            "refundIncome":this.o.inputRefundIntIncome.value,
            "OtherIntIncome":this.o.inputOthInterestIncome.value,
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
            "pfincometax":this.o.inputPFTax.value,
            "taxperiod" : this.o.taxperiod.value
          };
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
                      this.step1_income_salary_upload = false;
                      this.step1_income_from_salary = false;
                      this.step2 = true;
                      this.step2_income_other_data = false;
                      this.step2_income_other_upload = true;
                      this.step3 = false;
                      this.step4 = false;
                      this.step5 = false;
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
                      this.step1_income_salary_upload = false;
                      this.step1_income_from_salary = false;
                      this.step2 = false;
                      this.step2_income_other_data = false;
                      this.step2_income_other_upload = false;
                      this.step3 = true;
                      this.step3_house_property_data = false;
                      this.step3_house_property_upload = true; 
                      this.step4 = false;
                      this.step5 = false;
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

            "flatno":this.r.inpRentalPropFlatNo.value,
            "premises":this.r.inpRentalPropPremise.value,
            "street":this.r.inpRentalPropStreet.value,
            "area":this.r.inpRentalPropArea.value,
            "city":this.r.inpRentalPropCity.value,
            "pincode":this.r.inpRenPropPincode.value,
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
        // start storing application data in database
        this.appService.saveRentalIncomeDetails(rentIncomeInputParam)
        .pipe(first())
        .subscribe(
          data => {
                  //console.log("Response" + JSON.stringify(data));
                  //successfully inserted
                  if(data['statusCode'] == 200){
                        this.alertService.success('Application - Rental Income data saved successfully');
                        this.localStoreg['applicationStage'] = 12;
                        //console.log("LocalStore" + JSON.stringify(this.localStoreg));
                        localStorage.removeItem("currentUserApp");
                        localStorage.setItem("currentUserApp", JSON.stringify(this.localStoreg));
                        this.loading = false;
                        this.step1 = false;
                        this.step1_income_salary_upload = false;
                        this.step1_income_from_salary = false;
                        this.step2 = false;
                        this.step2_income_other_data = false;
                        this.step2_income_other_upload = false;
                        this.step3 = false;
                        this.step3_house_property_data = false;
                        this.step3_house_property_upload = false; 
                        this.step4 = true;
                        this.step4_rental_property_data = false;
                        this.step4_rental_property_upload = true;
                        this.step5 = false;
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
            "inpSaleType":this.c.inpSaleType.value,
            "inputSalesProceed":this.c.inputSalesProceed.value,
            "inputSalesDate":this.c.inputSalesDate.value,
            "inpSTTPaid":this.c.inpSTTPaid.value,
            "inputCostBasis":this.c.inputCostBasis.value,
            "inputPurDate":this.c.inputPurDate.value,
          };
        // start storing application data in database
        this.appService.saveCapitalIncomeDetails(capIncomeInputParam)
        .pipe(first())
        .subscribe(
          data => {
                  //console.log("Response" + JSON.stringify(data));
                  //successfully inserted
                  if(data['statusCode'] == 200){
                        this.alertService.error('Application - Captial Gains data saved successfully');
                        this.localStoreg['applicationStage'] = 13;
                        //console.log("LocalStore" + JSON.stringify(this.localStoreg));
                        localStorage.removeItem("currentUserApp");
                        localStorage.setItem("currentUserApp", JSON.stringify(this.localStoreg));
                        this.loading = false;
                        this.step1 = false;
                        this.step1_income_salary_upload = false;
                        this.step1_income_from_salary = false;
                        this.step2 = false;
                        this.step2_income_other_data = false;
                        this.step2_income_other_upload = false;
                        this.step3 = false;
                        this.step3_house_property_data = false;
                        this.step3_house_property_upload = false; 
                        this.step4 = false;
                        this.step4_rental_property_data = false;
                        this.step4_rental_property_upload = false;
                        this.step5 = true;
                        this.step5_captial_data = false;
                        this.step5_captial_upload = true;
                      }                
              },
          error => {
              this.alertService.error('Application - Captial Gains data save request failed '+error);
              this.loading = false;
          });
        break;
      }
  }

  //Function Called on previous button click
  on_previous_click(a){
    switch(a){
      case "step1_income_salary_upload":
        this.router.navigate(['taxfilling/personalinfo']);
      break;

      case "step1_income_from_salary":
        this.step1 = true;
        this.step1_income_salary_upload = true;
        this.step1_income_from_salary = false;
        this.step2 = false;
        this.step3 = false;
        this.step4 = false;
        this.step5 = false;
      break;

      case "step2_income_other_data":
      this.step1 = true;
      this.step1_income_salary_upload = false;
      this.step1_income_from_salary = true;
      this.step2 = false;
      this.step2_income_other_data = false;
      this.step2_income_other_upload = false;
      this.step3 = false;
      this.step4 = false;
      this.step5 = false;
      break;

      case "step2_income_other_upload":
        this.step1 = false;
        this.step1_income_salary_upload = false;
        this.step1_income_from_salary = false;
        this.step2 = true;
        this.step2_income_other_data = true;
        this.step2_income_other_upload = false;
        this.step3 = false;
        this.step4 = false;
        this.step5 = false;
      break;

      case "step3_house_property_data":
        this.step1 = false;
        this.step1_income_salary_upload = false;
        this.step1_income_from_salary = false;
        this.step2 = true;
        this.step2_income_other_data = false;
        this.step2_income_other_upload = true;
        this.step3 = false;
        this.step3_house_property_data = false;
        this.step3_house_property_upload = false; 
        this.step4 = false;
        this.step5 = false;
      break;

      case "step3_house_property_upload":
        this.step1 = false;
        this.step1_income_salary_upload = false;
        this.step1_income_from_salary = false;
        this.step2 = false;
        this.step2_income_other_data = false;
        this.step2_income_other_upload = false;
        this.step3 = true;
        this.step3_house_property_data = true;
        this.step3_house_property_upload = false; 
        this.step4 = false;
        this.step5 = false;
      break;

      case "step4_rental_property_data":
        this.step1 = false;
        this.step1_income_salary_upload = false;
        this.step1_income_from_salary = false;
        this.step2 = false;
        this.step2_income_other_data = false;
        this.step2_income_other_upload = false;
        this.step3 = true;
        this.step3_house_property_data = false;
        this.step3_house_property_upload = true; 
        this.step4 = false;
        this.step4_rental_property_data = false;
        this.step4_rental_property_upload = false;
        this.step5 = false;
      break;

      case "step4_rental_property_upload":
        this.step1 = false;
        this.step1_income_salary_upload = false;
        this.step1_income_from_salary = false;
        this.step2 = false;
        this.step2_income_other_data = false;
        this.step2_income_other_upload = false;
        this.step3 = false;
        this.step3_house_property_data = false;
        this.step3_house_property_upload = false; 
        this.step4 = true;
        this.step4_rental_property_data = true;
        this.step4_rental_property_upload = false;
        this.step5 = false;
      break;

      case "step5_captial_data":
        this.step1 = false;
        this.step1_income_salary_upload = false;
        this.step1_income_from_salary = false;
        this.step2 = false;
        this.step2_income_other_data = false;
        this.step2_income_other_upload = false;
        this.step3 = false;
        this.step3_house_property_data = false;
        this.step3_house_property_upload = false; 
        this.step4 = true;
        this.step4_rental_property_data = false;
        this.step4_rental_property_upload = true;
        this.step5 = false;
        this.step5_captial_data = false;
      this.step5_captial_upload = false;
      break;

      case "step5_captial_upload":
        this.step1 = false;
        this.step1_income_salary_upload = false;
        this.step1_income_from_salary = false;
        this.step2 = false;
        this.step2_income_other_data = false;
        this.step2_income_other_upload = false;
        this.step3 = false;
        this.step3_house_property_data = false;
        this.step3_house_property_upload = false; 
        this.step4 = false;
        this.step4_rental_property_data = false;
        this.step4_rental_property_upload = false;
        this.step5 = true;
        this.step5_captial_data = true;
        this.step5_captial_upload = false;
      break;
    }
  }

  on_skip_click(a){
    switch(a){
      case "step1_income_salary_upload":
        this.step1 = true;
        this.step1_income_salary_upload = false;
        this.step1_income_from_salary = true;
        this.step2 = false;
        this.step3 = false;
        this.step4 = false;
        this.step5 = false;
      break;

      case "step1_income_from_salary":
        this.step1 = false;
        this.step1_income_salary_upload = false;
        this.step1_income_from_salary = false;
        this.step2 = true;
        this.step2_income_other_data = true;
        this.step2_income_other_upload = false;
        this.step3 = false;
        this.step4 = false;
        this.step5 = false;
      break;

      case "step2_income_other_data":
      this.step1 = false;
      this.step1_income_salary_upload = false;
      this.step1_income_from_salary = false;
      this.step2 = true;
      this.step2_income_other_data = false;
      this.step2_income_other_upload = true;
      this.step3 = false;
      this.step4 = false;
      this.step5 = false;
      break;

      case "step2_income_other_upload":
        this.step1 = false;
        this.step1_income_salary_upload = false;
        this.step1_income_from_salary = false;
        this.step2 = false;
        this.step2_income_other_data = false;
        this.step2_income_other_upload = false;
        this.step3 = true;
        this.step3_house_property_data = true;
        this.step3_house_property_upload = false; 
        this.step4 = false;
        this.step5 = false;
      break;

      case "step3_house_property_data":
        this.step1 = false;
        this.step1_income_salary_upload = false;
        this.step1_income_from_salary = false;
        this.step2 = false;
        this.step2_income_other_data = false;
        this.step2_income_other_upload = false;
        this.step3 = true;
        this.step3_house_property_data = false;
        this.step3_house_property_upload = true; 
        this.step4 = false;
        this.step5 = false;
      break;

      case "step3_house_property_upload":
        this.step1 = false;
        this.step1_income_salary_upload = false;
        this.step1_income_from_salary = false;
        this.step2 = false;
        this.step2_income_other_data = false;
        this.step2_income_other_upload = false;
        this.step3 = false;
        this.step3_house_property_data = false;
        this.step3_house_property_upload = false; 
        this.step4 = true;
        this.step4_rental_property_data = true;
        this.step4_rental_property_upload = false;
        this.step5 = false;
      break;

      case "step4_rental_property_data":
        this.step1 = false;
        this.step1_income_salary_upload = false;
        this.step1_income_from_salary = false;
        this.step2 = false;
        this.step2_income_other_data = false;
        this.step2_income_other_upload = false;
        this.step3 = false;
        this.step3_house_property_data = false;
        this.step3_house_property_upload = false; 
        this.step4 = true;
        this.step4_rental_property_data = false;
        this.step4_rental_property_upload = true;
        this.step5 = false;
      break;

      case "step4_rental_property_upload":
        this.step1 = false;
        this.step1_income_salary_upload = false;
        this.step1_income_from_salary = false;
        this.step2 = false;
        this.step2_income_other_data = false;
        this.step2_income_other_upload = false;
        this.step3 = false;
        this.step3_house_property_data = false;
        this.step3_house_property_upload = false; 
        this.step4 = false;
        this.step4_rental_property_data = false;
        this.step4_rental_property_upload = false;
        this.step5 = true;
        this.step5_captial_data = true;
        this.step5_captial_upload = false;
      break;

      case "step5_captial_data":
        this.step1 = false;
        this.step1_income_salary_upload = false;
        this.step1_income_from_salary = false;
        this.step2 = false;
        this.step2_income_other_data = false;
        this.step2_income_other_upload = false;
        this.step3 = false;
        this.step3_house_property_data = false;
        this.step3_house_property_upload = false; 
        this.step4 = false;
        this.step4_rental_property_data = false;
        this.step4_rental_property_upload = false;
        this.step5 = true;
        this.step5_captial_data = false;
        this.step5_captial_upload = true;
      break;

      case "step5_captial_upload":
        this.router.navigate(['taxfilling/deductions']);
      break;
    }
  }

  //Function Called on Reset button click
  on_reset_click(a){
    switch(a){
      case "step1_income_salary_upload":
        this.salaryIncomeUploadForm.reset();
      break;

      case "step1_income_from_salary":
      this.salaryIncomeForm.reset();
      break;

      case "step2_income_other_data":
        this.otherIncomeForm.reset();
      break;

      case "step2_income_other_upload":
      this.otherIncomeUploadForm.reset();
      break;

      case "step3_house_property_data":
        this.housePropIncomeForm.reset();
      break;

      case "step3_house_property_upload":
        this.housePropIncomeUploadForm.reset();
      break;

      case "step4_rental_property_data":
        this.rentalPropIncomeForm.reset();
      break;

      case "step4_rental_property_upload":
        this.rentalPropIncomeUploadForm.reset();
      break;

      case "step5_captial_data":
        this.captialIncomeForm.reset();
      break;

      case "step5_captial_upload":
        this.captialIncomeUploadForm.reset();
      break;
    }
  }

  //Function to enable forms from naviagtion icons
  select_form_step(a){
    if(a == 'step1'){
      this.step1 = true;
      this.step1_income_salary_upload = true;
      this.step1_income_from_salary = false;
      this.step2 = false;
      this.step3 = false;
      this.step4 = false;
      this.step5 = false;
    }
    if(a == 'step2'){
      this.step1 = false;
      this.step2 = true;
      this.step2_income_other_data = true;
      this.step2_income_other_upload = false;
      this.step3 = false;
      this.step4 = false;
      this.step5 = false;
    }
    if(a == 'step3'){
      this.step1 = false;
      this.step2 = false;
      this.step3 = true;
      this.step3_house_property_data = true;
      this.step3_house_property_upload = false; 
      this.step4 = false;
      this.step5 = false;
    }
    if(a == 'step4'){
      this.step1 = false;
      this.step2 = false;
      this.step3 = false;
      this.step4 = true;
      this.step4_rental_property_data = true;
      this.step4_rental_property_upload = false;
      this.step5 = false;
    }
    if(a == 'step5'){
      this.step1 = false;
      this.step2 = false;
      this.step3 = false;
      this.step4 = false;
      this.step5 = true;
      this.step5_captial_data = true;
      this.step5_captial_upload = false;
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

  select_step5_subpart_form(x){
    if(x == 'captial_upload'){
      this.step5_captial_upload = true;
      this.step5_captial_data = false;
    }
    if(x == 'captial_data'){
      this.step5_captial_upload = false;
      this.step5_captial_data = true;
    }
  }

  /*Function to create list of Assesment year dropdowns */
  getCurrentAssesmentYear() {
    var currentAYear = "";
    var prevAYear = "";
    var prevLAYear = "";
    var assYearList = [];
    var today = new Date();
    if ((today.getMonth() + 1) <= 3) {
        currentAYear = today.getFullYear() + "-" + (today.getFullYear()+1);
    } else {
        currentAYear = (today.getFullYear()+1) + "-" + (today.getFullYear() + 2);
    }

    if ((today.getMonth() + 1) <= 3) {
        prevAYear = (today.getFullYear()-1) + "-" + today.getFullYear();
    } else {
        prevAYear = today.getFullYear() + "-" + (today.getFullYear() + 1);
    }

    if ((today.getMonth() + 1) <= 3) {
        prevLAYear = (today.getFullYear()-2) + "-" + (today.getFullYear()-1);
    } else {
        prevLAYear = (today.getFullYear()-1) + "-" + today.getFullYear();
    }
    assYearList.push(currentAYear);
    assYearList.push(prevAYear);
    //assYearList.push(prevLAYear);
    return assYearList;
  }

}
