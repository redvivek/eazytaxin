import { Component, OnInit,AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators,FormArray } from '@angular/forms';
import { first, ignoreElements } from 'rxjs/operators';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { ScriptService,AuthenticationService,ApplicationService, AlertService } from '@app/_services';
import { environment } from '@environments/environment';
import { handleInsideHeaderBackground,handleFloatingLabels,formSticky,getFileSizeNameAndType } from '../../app.helpers';
import * as Waves from 'node-waves';

const URL = `${environment.apiUrl}/tax/uploadproofDocuments`;

@Component({
  selector: 'app-personal-details',
  templateUrl: './personal-details.component.html',
  styleUrls: ['./personal-details.component.css']
})
export class PersonalDetailsComponent implements OnInit,AfterViewInit {
  //Initialize all sub forms
  personalDetailsForm: FormGroup;
  addressDetailsForm: FormGroup;
  priBankDetailsForm: FormGroup;
  othBankDetailsForm: FormGroup;
  immAssestsDetailsForm: FormGroup;
  movAssestsDetailsForm: FormGroup;
  forAssestsDetailsForm: FormGroup;
  items: FormArray;
  loading = false;
  immAssestsForm = false;
  nextButtonDisable = false;
  previousButtonDisable = false;
  //flag to check submitted event on each subform
  perSubmitted = false;
  addSubmitted = false;
  priBankSubmitted = false;
  othBankSubmitted = false;
  immAssSubmitted = false;
  movAssSubmitted = false;
  forAssSubmitted = false;
  
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
  selPriAcctype:string = "";
  selSecAcctype:string = "";
  assYear:string;

  localStoreg = JSON.parse(localStorage.getItem("currentUserApp"));
  
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private appService : ApplicationService,
    private alertService : AlertService,
    private scriptservice : ScriptService
  ) {
      // redirect to login if not logged in
      if (!this.authenticationService.currentUserValue) { 
        this.router.navigate(['/login']);
      }else{
        //console.log("Current user value "+ JSON.stringify(this.authenticationService.currentUserValue));
        this.userId         = this.authenticationService.currentUserValue.userid;
        
        //console.log("Current App value "+ this.appService.currentApplicationValue);
        if(this.appService.currentApplicationValue != null){
          this.ApplicationId  = this.appService.currentApplicationValue.appId;
          this.assYear        = this.appService.currentApplicationValue.taxperiod; 
        }else{
          this.nextButtonDisable = true;
          this.previousButtonDisable = true;
        }
        //console.log("Current App Id "+ this.ApplicationId);
      }
  }

  public uploader: FileUploader = new FileUploader({
    url: URL, 
    itemAlias: 'uploadproofDocuments'
  });

  ngOnInit() {
    this.personalDetailsForm = this.formBuilder.group({
      Firstname: ['',
        [ 
          Validators.required,
          Validators.maxLength(25),
          Validators.pattern('^[a-zA-Z ]*$')
        ], 
      ],
      Lastname: ['', 
        [ 
          Validators.required,
          Validators.maxLength(75),
          Validators.pattern('^[a-zA-Z ]*$')
        ],
      ],
      Middlename:['',
        [ 
          Validators.maxLength(25),
          Validators.pattern('^[a-zA-Z ]*$')
        ],
      ],
      EmailId: ['', [
                Validators.required,
                Validators.maxLength(125),
                Validators.pattern("^([a-zA-Z0-9_.-]+)@([a-zA-Z0-9_.-]+)\\.([a-zA-Z]{2,5})$")
               ], ],
      Fathername: ['',
        [ 
          Validators.required,
          Validators.maxLength(125),
          Validators.pattern('^[a-zA-Z ]*$')
        ],
      ],
      MobileNo: ['', 
        [
          Validators.required,
          Validators.pattern("^[0-9]*$"),
          Validators.maxLength(10) 
        ],
      ],
      AltMobileNo:['',
        [
          Validators.pattern("^[0-9]*$"),
          Validators.maxLength(10) 
        ],
      ],
      //landlineNo:[''],
      DateOfBirth: ['', Validators.required ],
      //Gender: ['', Validators.required ],
      //EmployerName: ['', Validators.required ],
      //EmployerType: ['', Validators.required ],
      PanNumber: ['', 
        [
          Validators.required,
          Validators.maxLength(10),
          Validators.pattern("^([a-z]{3}[p][a-z][0-9]{4}[a-z])*$"), 
        ],
      ],
      AadharNumber:['',[
                Validators.required,
                Validators.pattern("^[0-9]*$"),
                Validators.maxLength(28) 
      ],],
      //PassportNumber:['']
    },{validator: this.checkPANUniquness('PanNumber','Lastname')}
    );

    this.addressDetailsForm = this.formBuilder.group({
      Flatno_Blockno: ['',
        [ 
          Validators.required,
          Validators.maxLength(50)
        ],
      ],
      Building_Village_Premises:['',
        [ 
          Validators.required,
          Validators.maxLength(50)
        ],
      ],
      Road_Street_PO:['', 
        [ 
          Validators.required,
          Validators.maxLength(50)
        ],
      ],
      Area_Locality:['',
        [ 
          Validators.required,
          Validators.maxLength(50)
        ],
      ],
      Pincode: ['', 
        [ 
          Validators.required,
          Validators.maxLength(6),
          Validators.pattern("^([1-9]{1}[0-9]{5})*$"),
        ], 
      ],
      City_Town_District: ['', 
        [ 
          Validators.required,
          Validators.maxLength(50)
        ],
      ],
      State: ['', Validators.required ],
      Country: ['', Validators.required ]
    });

    this.priBankDetailsForm = this.formBuilder.group({
      PrimaryAccNumber: ['',
        [ 
          Validators.required,
          Validators.maxLength(20),
          Validators.pattern("^([a-zA-Z0-9]([/-]?(((\d*[1-9]\d*)*[a-zA-Z/-])|(\d*[1-9]\d*[a-zA-Z]*))+)*[0-9])*$"),
        ],
      ],
      PrimaryBankNm: ['', 
        [ 
          Validators.required,
          Validators.maxLength(125)
        ], 
      ],
      PrimaryIFSCCode: ['', 
        [ 
          Validators.required,
          Validators.maxLength(11),
          Validators.pattern("^([A-Z]{4}[0][A-Z0-9]{6})*$"),
        ], 
      ],
      itemRows: this.formBuilder.array([this.initItemRows()]),
    });

    this.othBankDetailsForm = this.formBuilder.group({
      itemRows: this.formBuilder.array([this.initItemRows()]),
    });

    this.immAssestsDetailsForm = this.formBuilder.group({
      immovableAssetsFlag:['0'],
      Description: ['',
        [ 
          Validators.maxLength(100)
        ],
      ],
      FlatNo: ['',
        [ 
          Validators.maxLength(50)
        ],
      ],
      PremiseName:['',
        [ 
          Validators.maxLength(50)
        ],
      ],
      StreetName:['', 
        [ 
          Validators.maxLength(50)
        ],
      ],
      AreaLocality:['',
        [ 
          Validators.maxLength(50)
        ],
      ],
      immovable_Pincode: ['', 
        [ 
          Validators.maxLength(6),
          Validators.pattern("^([1-9]{1}[0-9]{5})*$"),
        ], 
      ],
      immovable_City: ['', 
        [ 
          Validators.maxLength(50)
        ],
      ],
      immovable_State: [''],
      country: [''],

      cost_purchase_price:['',
        [ 
          Validators.pattern("^[0-9]+(.[0-9]{0,2})?$")
        ],
      ],
      liabilities_in_relation_immovable_assets:['',
        [ 
          Validators.pattern("^[0-9]+(.[0-9]{0,2})?$")
        ],
      ],
    });

    this.movAssestsDetailsForm = this.formBuilder.group({
      MovJwellaryItemsAmount:['',[ 
        Validators.pattern("^[0-9]+(.[0-9]{0,2})?$")
      ],],
      MovCraftItemsAmount:['',[ 
        Validators.pattern("^[0-9]+(.[0-9]{0,2})?$")
      ],],
      MovConveninceItemsAmount:['',[ 
        Validators.pattern("^[0-9]+(.[0-9]{0,2})?$")
      ],],
      MovFABankAmount:['',[ 
        Validators.pattern("^[0-9]+(.[0-9]{0,2})?$")
      ],],
      MovFASharesAmount:['',[ 
        Validators.pattern("^[0-9]+(.[0-9]{0,2})?$")
      ],],
      MovFAInsAmount:['',[ 
        Validators.pattern("^[0-9]+(.[0-9]{0,2})?$")
      ],],
      MovFALoansGivenAmount:['',[ 
        Validators.pattern("^[0-9]+(.[0-9]{0,2})?$")
      ],],
      MovInHandCashAmount:['',[ 
        Validators.pattern("^[0-9]+(.[0-9]{0,2})?$")
      ],],
      TotalLiability:['',[ 
        Validators.pattern("^[0-9]+(.[0-9]{0,2})?$")
      ],]
    });

    this.forAssestsDetailsForm = this.formBuilder.group({
      uploadForeignAssetsFile:[''],
      uploadForeignAssetsFilepwd:[''],
      uploadFAProofFlag:['0'] 
    });

    this.autoFillPersonalInfoForm(this.ApplicationId);
    this.autoFillAddressInfoForm(this.ApplicationId);
    this.autoFillBankInfoForm(this.ApplicationId);
    this.autoFillAssestsInfoForm(this.ApplicationId);

    //File Uploader with form data
    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };

    this.uploader.onBuildItemForm = (fileItem: any, form: any) => { 
      form.append('UserId', this.userId);
      form.append('ApplicationId', this.ApplicationId);
      form.append('DocCategory', 'ForeignAssets');
      form.append('FilePassword', this.forAssestsDetailsForm.get('uploadForeignAssetsFilepwd').value);
    };

    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
          console.log('ImageUpload:uploaded:', item, status, response);
          console.log('Response '+ response); 
          var res = JSON.parse(response);
          //alert('File uploaded successfully');
          if(res['statusCode'] == 200){                 
            this.alertService.success('File Uploaded successfully');
            this.forAssestsDetailsForm.get('uploadFAProofFlag').setValue('1');
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

  get f() { return this.personalDetailsForm.controls; }
  get a() { return this.addressDetailsForm.controls; }
  get b() { return this.priBankDetailsForm.controls; }
  get o() { return this.othBankDetailsForm.controls; }
  get s() { return this.immAssestsDetailsForm.controls; }
  get m() { return this.movAssestsDetailsForm.controls; }
  get r() { return this.forAssestsDetailsForm.controls; }

  get addBankDetailsformArr() {
    return this.othBankDetailsForm.get('itemRows') as FormArray;
  }

  initItemRows() {
    return this.formBuilder.group({
      SecAccNumber: ['',
        [ 
          Validators.maxLength(20),
          Validators.pattern("^([a-zA-Z0-9]([/-]?(((\d*[1-9]\d*)*[a-zA-Z/-])|(\d*[1-9]\d*[a-zA-Z]*))+)*[0-9])*$"),
        ],
      ],
      SecBankNm: ['', 
        [ 
          Validators.maxLength(125)
        ], 
      ],
      SecIFSCCode: ['', 
        [ 
          Validators.maxLength(11),
          Validators.pattern("^([A-Z]{4}[0][A-Z0-9]{6})*$"),
        ], 
      ],
    });
  }

  addNewRow() {
    this.addBankDetailsformArr.push(this.initItemRows());
  }

  deleteRow(index: number) {
    this.addBankDetailsformArr.removeAt(index);
  }
  getBankAccNoValidity(index:number){
    return this.addBankDetailsformArr.controls[index].get('SecAccNumber').errors;
  }
  getBankAccNmValidity(index:number){
    return this.addBankDetailsformArr.controls[index].get('SecBankNm').errors;
  }
  getBankIFSCValidity(index:number){
    return this.addBankDetailsformArr.controls[index].get('SecIFSCCode').errors;
  }

  //validation to check PAN uniquness with Lastname and DB values
  private checkPANUniquness(panKey: string, lastNameKey: string) {
    return (group: FormGroup) => {
        const panInput = group.controls[panKey];
        const lastNameInput = group.controls[lastNameKey];
        
        if (panInput.errors && !panInput.errors.notEquivalent) {
            // return if another validator has already found an error on the matchingControl
            return;
        }
        if (lastNameInput.errors && !lastNameInput.errors.notEquivalent) {
          // return if another validator has already found an error on the matchingControl
          return;
        }
        const panVal = panInput.value;
        const panChar = panVal.charAt(4);
        const lastnmVal = lastNameInput.value;
        const lastnmChar = lastnmVal.charAt(0);
        if (panChar.toUpperCase() !== lastnmChar.toUpperCase()) {
          return panInput.setErrors({notValid: true});
        } else {
          this.appService.checkExistingPan(panVal,this.userId)
          .pipe(first())
          .subscribe(
              data  => {
                //console.log("Response"+JSON.stringify(data));
                if(data['statusCode'] == 200 && data['Message'] == "InValid"){
                  return panInput.setErrors({notUnique: true});
                }else if(data['statusCode'] == 200 && data['Message'] == "Valid"){
                  return panInput.setErrors(null);
                }
            },
            error => {
                console.log("Issue in Fetching PAN detailes"+JSON.stringify(error));
                this.loading = false;
                return panInput.setErrors({notUnique: true});
            });
        }
    };
  }

  /* Function to enable/disable & validate file upload form field on Radio change event */
  onChange(event): void {
    const newVal = event.target.value;
    //console.log("asDas" +newVal);
    const immAssetsDetails = this.immAssestsDetailsForm.get('Description');
    const inputflatno = this.immAssestsDetailsForm.get('FlatNo');
    const inputPremnm = this.immAssestsDetailsForm.get('PremiseName');
    const inputStreetnm = this.immAssestsDetailsForm.get('StreetName');
    const inputArea = this.immAssestsDetailsForm.get('AreaLocality');
    const inputCity = this.immAssestsDetailsForm.get('immovable_City');
    const inputState = this.immAssestsDetailsForm.get('immovable_State');
    const inputPincode = this.immAssestsDetailsForm.get('immovable_Pincode');
    const inputCountry = this.immAssestsDetailsForm.get('country');
    const inputCost = this.immAssestsDetailsForm.get('cost_purchase_price');
    const inputTotalLiabilites = this.immAssestsDetailsForm.get('liabilities_in_relation_immovable_assets');

    if (newVal == true) {
      this.immAssestsForm = true;
      immAssetsDetails.setValidators([Validators.required]);
      inputflatno.setValidators([Validators.required]);
      inputPremnm.setValidators([Validators.required]);
      inputStreetnm.setValidators([Validators.required]);
      inputArea.setValidators([Validators.required]);
      inputCity.setValidators([Validators.required]);
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
      inputCity.clearValidators();
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
    inputCity.updateValueAndValidity();
    inputState.updateValueAndValidity();
    inputPincode.updateValueAndValidity();
    inputCountry.updateValueAndValidity();
    inputCost.updateValueAndValidity();
    inputTotalLiabilites.updateValueAndValidity();
  }

  onAddressCheck(event):void{
    const targetChkBox = event.target;
    console.log("Checkbox event & value " +targetChkBox.checked+" - "+targetChkBox.value);
    const inputflatno = this.immAssestsDetailsForm.get('FlatNo');
    const inputPremnm = this.immAssestsDetailsForm.get('PremiseName');
    const inputStreetnm = this.immAssestsDetailsForm.get('StreetName');
    const inputArea = this.immAssestsDetailsForm.get('AreaLocality');
    const inputCity = this.immAssestsDetailsForm.get('immovable_City');
    const inputState = this.immAssestsDetailsForm.get('immovable_State');
    const inputPincode = this.immAssestsDetailsForm.get('immovable_Pincode');
    const inputCountry = this.immAssestsDetailsForm.get('country');
    if (targetChkBox.checked) {
      inputflatno.setValue(this.addressDetailsForm.get('Flatno_Blockno').value);
      inputPremnm.setValue(this.addressDetailsForm.get('Building_Village_Premises').value);
      inputStreetnm.setValue(this.addressDetailsForm.get('Road_Street_PO').value);
      inputArea.setValue(this.addressDetailsForm.get('Area_Locality').value);
      inputPincode.setValue(this.addressDetailsForm.get('Pincode').value);
      inputCity.setValue(this.addressDetailsForm.get('City_Town_District').value);
      inputState.setValue(this.addressDetailsForm.get('State').value);
      inputCountry.setValue(this.addressDetailsForm.get('Country').value);
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
    }
  }

  addLiability(event):void{
    const newVal = event.target.value;
    //console.log("asDas" +newVal);
    if(newVal!= ""){
      this.immAssestsDetailsForm.get('liabilities_in_relation_immovable_assets').setValue(newVal);
    }
  }

  //fetch Personal info data by AppId
  autoFillPersonalInfoForm(appid){
    this.personalDetailsForm.get('EmailId').setValue(this.authenticationService.currentUserValue.email);
    this.appService.getPersonalInfoByAppId(appid)
    .pipe(first())
    .subscribe(
        data  => {
          //console.log("Response"+JSON.stringify(data));
          if(data != null){
              //Preload form with existing or default values
              this.personalDetailsForm.get('Firstname').setValue(data.Firstname);
              this.personalDetailsForm.get('Middlename').setValue(data.Middlename);
              this.personalDetailsForm.get('Lastname').setValue(data.Lastname);
              this.personalDetailsForm.get('EmailId').setValue(data.EmailId);
              this.personalDetailsForm.get('Fathername').setValue(data.Fathername);
              this.personalDetailsForm.get('MobileNo').setValue(data.MobileNo);
              this.personalDetailsForm.get('AltMobileNo').setValue(data.AltMobileNo);
              this.personalDetailsForm.get('DateOfBirth').setValue(data.DateOfBirth);
              //this.personalDetailsForm.get('Gender').setValue(data.Gender);
              //this.personalDetailsForm.get('EmployerType').setValue(data.EmployerType);
              this.personalDetailsForm.get('PanNumber').setValue(data.PanNumber);
              this.personalDetailsForm.get('AadharNumber').setValue(data.AadharNumber);
              handleFloatingLabels(Waves);
          }else{
            //this.autoFillPerInfoFormFromXML(this.ApplicationId,this.userId,"PersonalInfo");
          }
      },
      error => {
          console.log("AppMain fetch data error"+JSON.stringify(error));
          //this.loading = false;
          return error;
      });
  }

  autoFillPerInfoFormFromXML(appid,userid,category){
    this.appService.getDataFromXMLByUserId(appid,userid,category)
    .pipe(first())
    .subscribe(
        data  => {
          console.log("Response"+JSON.stringify(data));
          if(data['statusCode'] == 200){
              if (data['infoData']) {
                  //Preload form with existing or default values
                  this.personalDetailsForm.get('Firstname').setValue(data.Firstname);
                  this.personalDetailsForm.get('Middlename').setValue(data.Middlename);
                  this.personalDetailsForm.get('Lastname').setValue(data.Lastname);
                  this.personalDetailsForm.get('EmailId').setValue(data.EmailId);
                  this.personalDetailsForm.get('MobileNo').setValue(data.MobileNo);
                  this.personalDetailsForm.get('AltMobileNo').setValue(data.AltMobileNo);
                  this.personalDetailsForm.get('DateOfBirth').setValue(data.DateOfBirth);
                  //this.personalDetailsForm.get('Gender').setValue(data.Gender);
                  //this.personalDetailsForm.get('EmployerType').setValue(data.EmployerType);
                  this.personalDetailsForm.get('PanNumber').setValue(data.PanNumber);
                  this.personalDetailsForm.get('AadharNumber').setValue(data.AadharNumber);
                  handleFloatingLabels(Waves);
              }
          }else if(data['statusCode'] == 201){
              if (data['Message']) {
                  //console.log("Current App value"+ JSON.stringify(data['Message']));
              }
          }else if(data['statusCode'] == 204){
              if (data['Message']) {
                  //console.log("Current App value"+ JSON.stringify(data['Message']));
              }
          }
      },
      error => {
          console.log("AppMain fetch data error"+JSON.stringify(error));
          //this.loading = false;
          return error;
      });

  }

  //fetch address info data by AppId
  autoFillAddressInfoForm(appid){
    this.appService.getAddressInfoByAppId(appid,'Residence')
    .pipe(first())
    .subscribe(
        data  => {
          //console.log("Response"+JSON.stringify(data));
          if(data != null){
              //this.AppMainDetails =  data;
              //console.log("Existing perInfo "+ JSON.stringify(data));
              //Preload form with existing or default values
              this.addressDetailsForm.get('Flatno_Blockno').setValue(data.Flatno_Blockno);
              this.addressDetailsForm.get('Building_Village_Premises').setValue(data.Building_Village_Premises);
              this.addressDetailsForm.get('Road_Street_PO').setValue(data.Road_Street_PO);
              this.addressDetailsForm.get('Area_Locality').setValue(data.Area_Locality);
              this.addressDetailsForm.get('Pincode').setValue(data.Pincode);
              this.addressDetailsForm.get('City_Town_District').setValue(data.City_Town_District);
              this.addressDetailsForm.get('State').setValue(data.State);
              this.addressDetailsForm.get('Country').setValue(data.Country);
              handleFloatingLabels(Waves);
            }else{
              //this.autoFillAddInfoFormFromXML(this.ApplicationId,this.userId,"addressInfo");
            }
      },
      error => {
          //console.log("AppMain fetch data error"+JSON.stringify(error));
          //this.loading = false;
          return error;
      });
  }

  autoFillAddInfoFormFromXML(appid,userid,category){
    this.appService.getDataFromXMLByUserId(appid,userid,category)
    .pipe(first())
    .subscribe(
        data  => {
          //console.log("Response"+JSON.stringify(data));
          if(data['statusCode'] == 200){
              //Preload form with existing or default values
              this.addressDetailsForm.get('Flatno_Blockno').setValue(data.Flatno_Blockno);
              this.addressDetailsForm.get('Road_Street_PO').setValue(data.Road_Street_PO);
              this.addressDetailsForm.get('Area_Locality').setValue(data.Area_Locality);
              this.addressDetailsForm.get('Pincode').setValue(data.Pincode);
              this.addressDetailsForm.get('City_Town_District').setValue(data.City_Town_District);
              this.addressDetailsForm.get('State').setValue(data.State);
              this.addressDetailsForm.get('Country').setValue(data.Country);
              handleFloatingLabels(Waves);
          }else if(data['statusCode'] == 201){
              if (data['Message']) {
                  //console.log("Current App value"+ JSON.stringify(data['Message']));
              }
          }else if(data['statusCode'] == 204){
              if (data['Message']) {
                  //console.log("Current App value"+ JSON.stringify(data['Message']));
              }
          }
      },
      error => {
          console.log("AppMain fetch data error"+JSON.stringify(error));
          //this.loading = false;
          return error;
      });

  }

  autoFillBankInfoForm(appid){
    this.appService.getBankInfoByAppId(appid)
    .pipe(first())
    .subscribe(
        data  => {
          //console.log("Response"+JSON.stringify(data));
          if(data != null && data.length > 0){
            var j = 0;
            var othdata = data.length -1;
            //console.log("Other length "+ othdata);
            if(othdata > 1){
              for(var k=0;k<othdata-1;k++){
                this.addNewRow();
              }
            }
            for(var i=0;i<data.length;i++){
              //console.log("Existing perInfo "+ JSON.stringify(data[i]));
              if(data[i].AccountPriority == 'Primary'){
                //Preload form with existing or default values
                this.priBankDetailsForm.get('PrimaryAccNumber').setValue(data[i].AccountNumber);
                this.priBankDetailsForm.get('PrimaryBankNm').setValue(data[i].BankName);
                this.priBankDetailsForm.get('PrimaryIFSCCode').setValue(data[i].IFSCCode);
                handleFloatingLabels(Waves);
              }

              if(data[i].AccountPriority == 'Others'){
                //Preload form with existing or default values
                this.addBankDetailsformArr.controls[j].get('SecAccNumber').setValue(data[i].AccountNumber);
                this.addBankDetailsformArr.controls[j].get('SecBankNm').setValue(data[i].BankName);
                this.addBankDetailsformArr.controls[j].get('SecIFSCCode').setValue(data[i].IFSCCode);
                handleFloatingLabels(Waves);
                j = j+1;
              }

            }
          }else{
            //this.autoFillBankInfoFormFromXML(this.ApplicationId,this.userId,"bankInfo");
          }
      },
      error => {
          console.log("AppMain fetch data error"+JSON.stringify(error));
          //this.loading = false;
          return error;
      });
  }

  autoFillBankInfoFormFromXML(appid,userid,category){
    this.appService.getDataFromXMLByUserId(appid,userid,category)
    .pipe(first())
    .subscribe(
        data  => {
          //console.log("Response"+JSON.stringify(data));
          if(data['statusCode'] == 200 && data.length > 0){
            var j = 0;
            var othdata = data.length -1;
            //console.log("Other length "+ othdata);
            if(othdata > 1){
              for(var k=0;k<othdata-1;k++){
                this.addNewRow();
              }
            }
            for(var i=0;i<data.length;i++){
              //console.log("Existing perInfo "+ JSON.stringify(data[i]));
              if(data[i].AccountPriority == 'Primary'){
                //Preload form with existing or default values
                this.priBankDetailsForm.get('PrimaryAccNumber').setValue(data[i].AccountNumber);
                this.priBankDetailsForm.get('PrimaryBankNm').setValue(data[i].BankName);
                this.priBankDetailsForm.get('PrimaryIFSCCode').setValue(data[i].IFSCCode);
                handleFloatingLabels(Waves);
              }

              if(data[i].AccountPriority == 'Others'){
                //Preload form with existing or default values
                this.addNewRow();
                this.addBankDetailsformArr.controls[j].get('SecAccNumber').setValue(data[i].AccountNumber);
                this.addBankDetailsformArr.controls[j].get('SecBankNm').setValue(data[i].BankName);
                this.addBankDetailsformArr.controls[j].get('SecIFSCCode').setValue(data[i].IFSCCode);
                handleFloatingLabels(Waves);
                j = j+1;
              }

            }
          }else if(data['statusCode'] == 201){
              if (data['Message']) {
                  //console.log("Current App value"+ JSON.stringify(data['Message']));
              }
          }else if(data['statusCode'] == 204){
              if (data['Message']) {
                  //console.log("Current App value"+ JSON.stringify(data['Message']));
              }
          }
      },
      error => {
          console.log("AppMain fetch data error"+JSON.stringify(error));
          //this.loading = false;
          return error;
      });

  }

  autoFillAssestsInfoForm(appid){
    this.appService.getAssetsInfoByAppId(appid)
    .pipe(first())
    .subscribe(
        data  => {
          //console.log("Response"+JSON.stringify(data));
          if(data.length > 0 ){
              //Preload form with existing or default values
              var maindata = data[0].MainData;
              //console.log("Existing perInfo "+ JSON.stringify(maindata));
              this.immAssestsDetailsForm.get('immovableAssetsFlag').setValue(maindata.ImmovableAssetsFlag);
              if(maindata.ImmovableAssetsFlag == 1){
                this.immAssestsForm = true;
                }else{
                this.immAssestsForm = false;
              }

              var imdata = data[1].ImmData;
              //console.log("Existing perInfo1 "+ JSON.stringify(imdata));
              this.immAssestsDetailsForm.get('Description').setValue(imdata.Description);
              this.immAssestsDetailsForm.get('FlatNo').setValue(imdata.FlatNo);
              this.immAssestsDetailsForm.get('PremiseName').setValue(imdata.PremiseName);
              this.immAssestsDetailsForm.get('StreetName').setValue(imdata.StreetName);
              this.immAssestsDetailsForm.get('AreaLocality').setValue(imdata.AreaLocality);
              this.immAssestsDetailsForm.get('immovable_City').setValue(imdata.City);
              this.immAssestsDetailsForm.get('immovable_State').setValue(imdata.State);
              this.immAssestsDetailsForm.get('country').setValue(imdata.Country);
              this.immAssestsDetailsForm.get('immovable_Pincode').setValue(imdata.Pincode);
              this.immAssestsDetailsForm.get('cost_purchase_price').setValue(imdata.Amount);
              this.immAssestsDetailsForm.get('liabilities_in_relation_immovable_assets').setValue(imdata.Immlaibilityamt);
              this.movAssestsDetailsForm.get('MovJwellaryItemsAmount').setValue(maindata.MovJwellaryItemsAmount);
              this.movAssestsDetailsForm.get('MovCraftItemsAmount').setValue(maindata.MovCraftItemsAmount);
              this.movAssestsDetailsForm.get('MovConveninceItemsAmount').setValue(maindata.MovConveninceItemsAmount);
              this.movAssestsDetailsForm.get('MovFABankAmount').setValue(maindata.MovFABankAmount);
              this.movAssestsDetailsForm.get('MovFASharesAmount').setValue(maindata.MovFASharesAmount);
              this.movAssestsDetailsForm.get('MovFAInsAmount').setValue(maindata.MovFAInsAmount);
              this.movAssestsDetailsForm.get('MovFALoansGivenAmount').setValue(maindata.MovFALoansGivenAmount);
              this.movAssestsDetailsForm.get('MovInHandCashAmount').setValue(maindata.MovInHandCashAmount);
              this.movAssestsDetailsForm.get('TotalLiability').setValue(maindata.TotalLiability);
          }
      },
      error => {
          console.log("AppMain fetch data error"+JSON.stringify(error));
          this.loading = false;
          return error;
      });
  }

  onSubmit(formname,infoType) {
    var perInfoInputParam,addInfoInputParam,bankInfoInputParam,assetsInfoInputParam,ImmovableAssInputParam;  
    //console.log('SUCCESS!! :-)\n\n' + JSON.stringify(formname.value))
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
              //"Gender":this.f.Gender.value,
              //"EmployerType":this.f.EmployerType.value,
              "PanNumber":this.f.PanNumber.value,
              "AadharNumber":this.f.AadharNumber.value
            };
            // start storing application data in database
            this.appService.savePersonalInfoData(perInfoInputParam)
            .pipe(first())
            .subscribe(
              data => {
                      //console.log("Response" + JSON.stringify(data));
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
                      this.step4_primary_bank_acc = true;
                      this.step4_all_other_bank_acc = false;
                      this.step5 = false;
                  }
              },
          error => {
              this.alertService.error('Application - Address Info data save request failed '+error);
              this.loading = false;
          });
        break;
        case "pribankinfo":
          var details = [];
          var primaryBankObj = {
            "AccPriority":"Primary",
            "AccNumber":this.b.PrimaryAccNumber.value,
            "BankNm":this.b.PrimaryBankNm.value,
            "IFSCCode":this.b.PrimaryIFSCCode.value
          }
          details.push(primaryBankObj);
          
          bankInfoInputParam = {
            'appId':this.ApplicationId,
            'userId':this.userId,
            'accType':'Primary',
            'Details':details
          };
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
                        this.step4 = true;
                        this.step4_primary_bank_acc = false;
                        this.step4_all_other_bank_acc = true;
                        this.step5 = false;
                    }
                },
            error => {
                this.alertService.error('Application - Bank Info data save request failed '+error );
                this.loading = false;
            });
        break;

        case "othbankinfo":
          var details = [];
          var addBankDetails = this.o.itemRows.value;
          if(addBankDetails.length > 0 ){
            for(var i=0; i< addBankDetails.length;i++){
              if(addBankDetails[i].SecAccNumber != ""){
                var otherBankObj = {
                  "AccPriority":"Others",
                  "AccNumber":addBankDetails[i].SecAccNumber,
                  "BankNm":addBankDetails[i].SecBankNm,
                  "IFSCCode":addBankDetails[i].SecIFSCCode,
                }
                details.push(otherBankObj);
              }
            }
          }  
          
          bankInfoInputParam = {
            'appId':this.ApplicationId,
            'userId':this.userId,
            'accType':'Others',
            'Details':details
          };
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
                        this.step4_primary_bank_acc = false;
                        this.step4_all_other_bank_acc = false;
                        this.step5 = true;

                    }
                },
            error => {
                this.alertService.error('Application - Bank Info data save request failed '+error );
                this.loading = false;
            });
        break;    

        case "immAsstinfo":
          if(this.s.immovableAssetsFlag.value == 1){
            ImmovableAssInputParam = {
              'appId':this.ApplicationId,
              'userId':this.userId,
              "description":this.s.Description.value,
              "flatNo":this.s.FlatNo.value,
              "premiseName":this.s.PremiseName.value,
              "streetName":this.s.StreetName.value,
              "locality":this.s.AreaLocality.value,
              "city":this.s.immovable_City.value,
              "state":this.s.immovable_State.value,
              "pincode":this.s.immovable_Pincode.value,
              "country":this.s.country.value,
              "purchaseCost":this.s.cost_purchase_price.value,
              "totalLiabilites":this.s.liabilities_in_relation_immovable_assets.value
            };

            this.appService.saveImmAssestsInfoData(ImmovableAssInputParam)
            .pipe(first())
            .subscribe(
              data => {
                      //console.log("Response" + JSON.stringify(data));
                      //successfully inserted
                      if(data['statusCode'] == 200){ 
                            this.alertService.success('Application - Assests Info data saved successfully');
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
            this.localStoreg['applicationStage'] = 7;
            //console.log("LocalStore" + JSON.stringify(this.localStoreg));
            localStorage.removeItem("currentUserApp");
            localStorage.setItem("currentUserApp", JSON.stringify(this.localStoreg));
            this.loading = false;
            this.step2 = false;
            this.step3 = false;
            this.step4 = false;
            this.step4_primary_bank_acc = false;
            this.step4_all_other_bank_acc = false;
            this.step5 = true;
            this.step5_immovable = false;
            this.step5_movable = true;
            this.step5_foreign = false;
          }
        break;

        case "movAsstinfo":
          assetsInfoInputParam = {
            'appId':this.ApplicationId,
            'userId':this.userId,
            "immovableAssetsFlag":this.s.immovableAssetsFlag.value,
            "movJwellaryItemsAmount":this.m.MovJwellaryItemsAmount.value,
            "movCraftItemsAmount":this.m.MovCraftItemsAmount.value,
            "movConveninceItemsAmount":this.m.MovConveninceItemsAmount.value,
            "movFABankAmount":this.m.MovFABankAmount.value,
            "movFASharesAmount":this.m.MovFASharesAmount.value,
            "movFAInsAmount":this.m.MovFAInsAmount.value,
            "movFALoansGivenAmount":this.m.MovFALoansGivenAmount.value,
            "movInHandCashAmount":this.m.MovInHandCashAmount.value,
            "totalLiability":this.m.TotalLiability.value
          };
          // start storing application data in database
          this.appService.saveAssestsInfoData(assetsInfoInputParam)
          .pipe(first())
          .subscribe(
          data => {
                  //console.log("Response" + JSON.stringify(data));
                  //successfully inserted
                  if(data['statusCode'] == 200){
                      this.alertService.success('Application - Assests Info data saved successfully');
                      this.localStoreg['applicationStage'] = 7;
                      //console.log("LocalStore" + JSON.stringify(this.localStoreg));
                      localStorage.removeItem("currentUserApp");
                      localStorage.setItem("currentUserApp", JSON.stringify(this.localStoreg));
                      this.loading = false;
                      this.step2 = false;
                      this.step3 = false;
                      this.step4 = false;
                      this.step4_primary_bank_acc = false;
                      this.step4_all_other_bank_acc = false;
                      this.step5 = true;
                      this.step5_immovable = false;
                      this.step5_movable = false;
                      this.step5_foreign = true;              
                  }
              },
          error => {
              this.alertService.error('Application - Assests & Liabilites data save request failed '+error);
              this.loading = false;
          });
        break;

        case "forAsstinfo":
          assetsInfoInputParam = {
            'appId':this.ApplicationId,
            'userId':this.userId,
            "foreignAssFlag":this.r.uploadFAProofFlag.value
          };
          
          // start storing application data in database
          this.appService.updateAssestInfoData(assetsInfoInputParam)
          .pipe(first())
          .subscribe(
          data => {
                  //console.log("Response" + JSON.stringify(data));
                  //successfully inserted
                  if(data['statusCode'] == 200){
                      this.alertService.success('Application - Assests Info data saved successfully');
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
        break;
      }
  }
  
  //Function Called on next button click
  on_next_click(a){
    switch(a){
      case "step2":
        this.perSubmitted = true;
        this.loading = true;
        console.log("Personal details submitted");
        // stop here if form is invalid
        if (this.personalDetailsForm.invalid) {
          this.loading = false;
          return;
        }else{
          this.onSubmit(this.personalDetailsForm,'personalinfo');
        }
      break;

      case "step3":
        this.addSubmitted = true;
        this.loading = true;
        console.log("Address details submitted");
        if (this.addressDetailsForm.invalid) {
          this.loading = false;
          return;
        }else{
          this.onSubmit(this.addressDetailsForm,'addressinfo');
        }
      break;

      case "step4_primary_bank_acc":
        this.priBankSubmitted = true;
        this.loading = true;
        console.log("Primary Bank details submitted");
        if (this.priBankDetailsForm.invalid) {
          this.loading = false;
          return;
        }else{
          this.onSubmit(this.priBankDetailsForm,'pribankinfo');
        }
      break;

      case "step4_all_other_bank_acc":
        this.othBankSubmitted = true;
        this.loading = true;
        console.log("Other Bank details submitted");
        if (this.othBankDetailsForm.invalid) {
          this.loading = false;
          return;
        }else{
          this.onSubmit(this.othBankDetailsForm,'othbankinfo');
        }  
      break;

      case "step5_immovable":
        this.immAssSubmitted = true;
        this.loading = true;
        console.log("Immov Assests details submitted");
        if (this.immAssestsDetailsForm.invalid) {
          this.loading = false;
          return;
        }else{
          this.onSubmit(this.immAssestsDetailsForm,'immAsstinfo');
        }
      break;

      case "step5_movable":
        this.movAssSubmitted = true;
        this.loading = true;
        console.log("Mov Assests details submitted");
        if (this.movAssestsDetailsForm.invalid) {
          this.loading = false;
          return;
        }else{
          this.onSubmit(this.movAssestsDetailsForm,'movAsstinfo');
        }
      break;

      case "step5_foreign":
        this.forAssSubmitted = true;
        this.loading = true;
        console.log("Foreign Assests details submitted");
        if (this.forAssestsDetailsForm.invalid) {
          this.loading = false;
          return;
        }else{
          this.onSubmit(this.forAssestsDetailsForm,'forAsstinfo');
        }
      break;
    }
  }

  //Function Called on previous button click
  on_previous_click(a){
    switch(a){
      case "step2":
        this.router.navigate(['taxfilling/basicinfo']);
      break;

      case "step3":
        this.step2 = true;
        this.step3 = false;
        this.step4 = false;
        this.step4_primary_bank_acc = false;
        this.step4_all_other_bank_acc = false;
        this.step5 = false;
        this.step5_immovable = false;
        this.step5_movable = false;
        this.step5_foreign = false;
      break;

      case "step4_primary_bank_acc":
        this.step2 = false;
        this.step3 = true;
        this.step4 = false;
        this.step4_primary_bank_acc = false;
        this.step4_all_other_bank_acc = false;
        this.step5 = false;
        this.step5_immovable = false;
        this.step5_movable = false;
        this.step5_foreign = false;
      break;

      case "step4_all_other_bank_acc":
        this.step2 = false;
        this.step3 = false;
        this.step4 = true;
        this.step4_primary_bank_acc = true;
        this.step4_all_other_bank_acc = false;
        this.step5 = false;
        this.step5_immovable = false;
        this.step5_movable = false;
        this.step5_foreign = false;
      break;

      case "step5_immovable":
        this.step2 = false;
        this.step3 = false;
        this.step4 = true;
        this.step4_primary_bank_acc = false;
        this.step4_all_other_bank_acc = true;
        this.step5 = false;
        this.step5_immovable = false;
        this.step5_movable = false;
        this.step5_foreign = false;
      break;

      case "step5_movable":
        this.step2 = false;
        this.step3 = false;
        this.step4 = false;
        this.step4_primary_bank_acc = false;
        this.step4_all_other_bank_acc = false;
        this.step5 = true;
        this.step5_immovable = true;
        this.step5_movable = false;
        this.step5_foreign = false;
      break;

      case "step5_foreign":
        this.step2 = false;
        this.step3 = false;
        this.step4 = false;
        this.step4_primary_bank_acc = false;
        this.step4_all_other_bank_acc = false;
        this.step5 = true;
        this.step5_immovable = false;
        this.step5_movable = true;
        this.step5_foreign = false;
      break;
    }
  }
  
  //Function Called on Reset button click
  on_reset_click(a){
    switch(a){
      case "step2":
        this.personalDetailsForm.reset();
      break;

      case "step3":
        this.addressDetailsForm.reset();
      break;

      case "step4_primary_bank_acc":
        this.priBankDetailsForm.reset();
      break;

      case "step4_all_other_bank_acc":
        this.othBankDetailsForm.reset();
      break;

      case "step5_immovable":
        this.immAssestsDetailsForm.reset();
      break;

      case "step5_movable":
        this.movAssestsDetailsForm.reset();
      break;

      case "step5_foreign":
        this.forAssestsDetailsForm.reset();
      break;
    }
  }

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
      this.step4_primary_bank_acc = true;
      this.step4_all_other_bank_acc = false;
      this.step5 = false;
    }
    if(a == 'step5'){
      this.step2 = false;
      this.step3 = false;
      this.step4 = false;
      this.step5 = true;
      this.step5_immovable = true;
      this.step5_movable = false;
      this.step5_foreign = false;
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

  on_skip_click(a){
    switch(a){
      case "step4_all_other_bank_acc":
        this.step2 = false;
        this.step3 = false;
        this.step4 = false;
        this.step4_primary_bank_acc = false;
        this.step4_all_other_bank_acc = false;
        this.step5 = true;
        this.step5_immovable = true;
        this.step5_movable = false;
        this.step5_foreign = false;
      break;

      case "step5_immovable":
        this.step2 = false;
        this.step3 = false;
        this.step4 = false;
        this.step4_primary_bank_acc = false;
        this.step4_all_other_bank_acc = false;
        this.step5 = true;
        this.step5_immovable = false;
        this.step5_movable = true;
        this.step5_foreign = false;
      break;

      case "step5_movable":
        this.step2 = false;
        this.step3 = false;
        this.step4 = false;
        this.step4_primary_bank_acc = false;
        this.step4_all_other_bank_acc = false;
        this.step5 = true;
        this.step5_immovable = false;
        this.step5_movable = false;
        this.step5_foreign = true;
      break;

      case "step5_foreign":
        this.router.navigate(['taxfilling/earnings']);
      break;
    }
  }

  downloadSample(forAssetsSampleFile){

  }
}
