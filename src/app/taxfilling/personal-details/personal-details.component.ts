import { Component, OnInit,AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { ScriptService,AuthenticationService,ApplicationService, AlertService } from '@app/_services';
import { environment } from '@environments/environment';
import { handleInsideHeaderBackground,handleFloatingLabels } from '../../app.helpers';
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
  bankDetailsForm: FormGroup;
  assestsDetailsForm: FormGroup;
  
  loading = false;
  immAssestsForm = true;
  nextButtonDisable = false;
  previousButtonDisable = false;
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
  selPriAcctype:string = "";
  selSecAcctype:string = "";

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
        //console.log("Current App value "+ this.appService.currentApplicationValue);
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
    itemAlias: 'uploadproofDocuments'
  });

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
      country:[''],
      cost_purchase_price:['',Validators.required],
      liabilities_in_relation_immovable_assets:['',Validators.required],
      MovJwellaryItemsAmount:['',Validators.required],
      MovCraftItemsAmount:['',Validators.required],
      MovConveninceItemsAmount:['',Validators.required],
      MovFABankAmount:['',Validators.required],
      MovFASharesAmount:['',Validators.required],
      MovFAInsAmount:['',Validators.required],
      MovFALoansGivenAmount:['',Validators.required],
      MovInHandCashAmount:['',Validators.required],
      TotalLiability:['',Validators.required],
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
      form.append('FilePassword', this.assestsDetailsForm.get('uploadForeignAssetsFilepwd').value);
    };

    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
          console.log('ImageUpload:uploaded:', item, status, response);
          console.log('Response '+ response); 
          var res = JSON.parse(response);
          //alert('File uploaded successfully');
          if(res['statusCode'] == 200){                 
            this.alertService.error('File Uploaded successfully');
            this.assestsDetailsForm.get('uploadFAProofFlag').setValue('1');
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
  
  ngAfter

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
    //const inputCountry = this.assestsDetailsForm.get('country');
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
      //inputCountry.setValidators([Validators.required]);
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
      //inputCountry.clearValidators();
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
    //inputCountry.updateValueAndValidity();
    inputCost.updateValueAndValidity();
    inputTotalLiabilites.updateValueAndValidity();
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
            "foreignAssFlag":this.s.uploadFAProofFlag.value
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

  //fetch Personal info data by AppId
  autoFillPersonalInfoForm(appid){
    this.personalDetailsForm.get('EmailId').setValue(this.authenticationService.currentUserValue.email);
    this.appService.getPersonalInfoByAppId(appid)
    .pipe(first())
    .subscribe(
        data  => {
          //console.log("Response"+JSON.stringify(data));
          if(data != null){
              //this.AppMainDetails =  data;
              //console.log("Existing perInfo "+ JSON.stringify(data));
              //Preload form with existing or default values
              this.personalDetailsForm.get('Firstname').setValue(data.Firstname);
              this.personalDetailsForm.get('Middlename').setValue(data.Middlename);
              this.personalDetailsForm.get('Lastname').setValue(data.Lastname);
              this.personalDetailsForm.get('EmailId').setValue(data.EmailId);
              this.personalDetailsForm.get('Fathername').setValue(data.Fathername);
              this.personalDetailsForm.get('MobileNo').setValue(data.MobileNo);
              this.personalDetailsForm.get('AltMobileNo').setValue(data.AltMobileNo);
              this.personalDetailsForm.get('DateOfBirth').setValue(data.DateOfBirth);
              this.personalDetailsForm.get('Gender').setValue(data.Gender);
              this.personalDetailsForm.get('EmployerName').setValue(data.EmployerName);
              this.personalDetailsForm.get('EmployerType').setValue(data.EmployerType);
              this.personalDetailsForm.get('PanNumber').setValue(data.PanNumber);
              this.personalDetailsForm.get('AadharNumber').setValue(data.AadharNumber);
              this.personalDetailsForm.get('PassportNumber').setValue(data.PassportNumber);
          }else{
            this.autoFillPerInfoFormFromXML(this.ApplicationId,this.userId,"PersonalInfo");
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
          //console.log("Response"+JSON.stringify(data));
          if(data){
              //console.log("Existing perInfo "+ JSON.stringify(data));
              //Preload form with existing or default values
              this.personalDetailsForm.get('Firstname').setValue(data.Firstname);
              this.personalDetailsForm.get('Middlename').setValue(data.Middlename);
              this.personalDetailsForm.get('Lastname').setValue(data.Lastname);
              this.personalDetailsForm.get('EmailId').setValue(data.EmailId);
              this.personalDetailsForm.get('MobileNo').setValue(data.MobileNo);
              this.personalDetailsForm.get('AltMobileNo').setValue(data.AltMobileNo);
              this.personalDetailsForm.get('DateOfBirth').setValue(data.DateOfBirth);
              this.personalDetailsForm.get('Gender').setValue(data.Gender);
              this.personalDetailsForm.get('EmployerType').setValue(data.EmployerType);
              this.personalDetailsForm.get('PanNumber').setValue(data.PanNumber);
              this.personalDetailsForm.get('AadharNumber').setValue(data.AadharNumber);
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
            }else{
              this.autoFillAddInfoFormFromXML(this.ApplicationId,this.userId,"addressInfo");
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
          if(data){
              //console.log("Existing perInfo "+ JSON.stringify(data));
              //Preload form with existing or default values
              this.addressDetailsForm.get('Flatno_Blockno').setValue(data.Flatno_Blockno);
              this.addressDetailsForm.get('Road_Street_PO').setValue(data.Road_Street_PO);
              this.addressDetailsForm.get('Area_Locality').setValue(data.Area_Locality);
              this.addressDetailsForm.get('Pincode').setValue(data.Pincode);
              this.addressDetailsForm.get('City_Town_District').setValue(data.City_Town_District);
              this.addressDetailsForm.get('State').setValue(data.State);
              this.addressDetailsForm.get('Country').setValue(data.Country);
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
            for(var i=0;i<data.length;i++){
              //console.log("Existing perInfo "+ JSON.stringify(data[i]));
              if(data[i].AccountPriority == 'Primary'){
                //Preload form with existing or default values
                this.selPriAcctype = data[i].AccountType;
                this.bankDetailsForm.get('PrimaryAccNumber').setValue(data[i].AccountNumber);
                this.bankDetailsForm.get('PrimaryAccType').setValue(data[i].AccountType);
                this.bankDetailsForm.get('PrimaryBankNm').setValue(data[i].BankName);
                this.bankDetailsForm.get('PrimaryIFSCCode').setValue(data[i].IFSCCode);
              }

              if(data[i].AccountPriority == 'Others'){
                //Preload form with existing or default values
                this.selSecAcctype = data[i].AccountType;
                this.bankDetailsForm.get('SecAccNumber').setValue(data[i].AccountNumber);
                this.bankDetailsForm.get('SecAccType').setValue(data[i].AccountType);
                this.bankDetailsForm.get('SecBankNm').setValue(data[i].BankName);
                this.bankDetailsForm.get('SecIFSCCode').setValue(data[i].IFSCCode);
              }

            }
          }else{
            this.autoFillBankInfoFormFromXML(this.ApplicationId,this.userId,"bankInfo");
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
          console.log("Response"+JSON.stringify(data));
          if(data != null && data.length > 0){
            for(var i=0;i<data.length;i++){
              //console.log("Existing perInfo "+ JSON.stringify(data[i]));
              if(data[i].AccountPriority == 'Primary'){
                //Preload form with existing or default values
                this.selPriAcctype = data[i].AccountType;
                this.bankDetailsForm.get('PrimaryAccNumber').setValue(data[i].AccountNumber);
                this.bankDetailsForm.get('PrimaryAccType').setValue(data[i].AccountType);
                this.bankDetailsForm.get('PrimaryBankNm').setValue(data[i].BankName);
                this.bankDetailsForm.get('PrimaryIFSCCode').setValue(data[i].IFSCCode);
              }

              if(data[i].AccountPriority == 'Others'){
                //Preload form with existing or default values
                this.selSecAcctype = data[i].AccountType;
                this.bankDetailsForm.get('SecAccNumber').setValue(data[i].AccountNumber);
                this.bankDetailsForm.get('SecAccType').setValue(data[i].AccountType);
                this.bankDetailsForm.get('SecBankNm').setValue(data[i].BankName);
                this.bankDetailsForm.get('SecIFSCCode').setValue(data[i].IFSCCode);
              }

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
              this.assestsDetailsForm.get('immovableAssetsFlag').setValue(maindata.ImmovableAssetsFlag);
              this.assestsDetailsForm.get('MovJwellaryItemsAmount').setValue(maindata.MovJwellaryItemsAmount);
              this.assestsDetailsForm.get('MovCraftItemsAmount').setValue(maindata.MovCraftItemsAmount);
              this.assestsDetailsForm.get('MovConveninceItemsAmount').setValue(maindata.MovConveninceItemsAmount);
              this.assestsDetailsForm.get('MovFABankAmount').setValue(maindata.MovFABankAmount);
              this.assestsDetailsForm.get('MovFASharesAmount').setValue(maindata.MovFASharesAmount);
              this.assestsDetailsForm.get('MovFAInsAmount').setValue(maindata.MovFAInsAmount);
              this.assestsDetailsForm.get('MovFALoansGivenAmount').setValue(maindata.MovFALoansGivenAmount);
              this.assestsDetailsForm.get('MovInHandCashAmount').setValue(maindata.MovInHandCashAmount);
              this.assestsDetailsForm.get('TotalLiability').setValue(maindata.TotalLiability);

              if(maindata.ImmovableAssetsFlag == 1){
                var imdata = data[1].ImmData;
                //console.log("Existing perInfo1 "+ JSON.stringify(imdata));
                this.assestsDetailsForm.get('Description').setValue(imdata.Description);
                this.assestsDetailsForm.get('FlatNo').setValue(imdata.FlatNo);
                this.assestsDetailsForm.get('PremiseName').setValue(imdata.PremiseName);
                this.assestsDetailsForm.get('StreetName').setValue(imdata.StreetName);
                this.assestsDetailsForm.get('AreaLocality').setValue(imdata.AreaLocality);
                this.assestsDetailsForm.get('immovable_State').setValue(imdata.State);
                this.assestsDetailsForm.get('immovable_Pincode').setValue(imdata.Pincode);
                //this.assestsDetailsForm.get('country').setValue(data.Country);
                this.assestsDetailsForm.get('cost_purchase_price').setValue(imdata.Amount);
                this.assestsDetailsForm.get('liabilities_in_relation_immovable_assets').setValue(imdata.Amount);
              }
              
              
          }
      },
      error => {
          console.log("AppMain fetch data error"+JSON.stringify(error));
          //this.loading = false;
          return error;
      });
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
      this.router.navigate(['taxfilling/basicinfo']);
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
  on_reset_click(){
    if (this.step2 == true) {
      this.personalDetailsForm.reset();
    }
    if (this.step3 == true) {
      this.addressDetailsForm.reset();
    }
    if (this.step4 == true) {
      this.bankDetailsForm.reset();
    }
    if (this.step5 == true) {
      this.assestsDetailsForm.reset();
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
