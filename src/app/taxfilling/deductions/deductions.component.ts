import { Component, OnInit,AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators,FormArray } from '@angular/forms';
import { first } from 'rxjs/operators';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { environment } from '@environments/environment';
import { ScriptService,AuthenticationService,ApplicationService, AlertService } from '@app/_services';
import { handleInsideHeaderBackground,handleFloatingLabels,formSticky } from '../../app.helpers';
import * as Waves from 'node-waves';

const URL = `${environment.apiUrl}/tax/uploadproofDocuments`;

@Component({
  selector: 'app-deductions',
  templateUrl: './deductions.component.html',
  styleUrls: ['./deductions.component.css']
})
export class DeductionsComponent implements OnInit,AfterViewInit {
  mainDeductionForm: FormGroup;
  otherDeductionForm: FormGroup;
  proofDocUploadForm: FormGroup;
  otherDeductionChkboxForm:FormGroup;

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
  step2_section80CCCG :boolean = false;
  step2_section80E :boolean = false;
  step2_section80CCC :boolean = false;
  step2_section80CCD1 :boolean = true;
  step2_section80CCD2 :boolean = true;
  step2_section80GG :boolean = false;
  step2_section80DDB :boolean = false;
  step2_section80EE :boolean = false;
  step2_section80QQB :boolean = false;
  step2_section80RRB :boolean = false;
  step2_section80GGA :boolean = false;
  step2_section80GGC :boolean = false;
  //step2_section80U :boolean = false;
  //step2_section80DD :boolean = false;
  

  //Global variables to save userdId and ApplictionID
  userId : number;
  ApplicationId : number = null;
  nextButtonDisable = false;
  previousButtonDisable = false;
  selectedInvstItems = [];
  setdisable = false;
  uploadFieldsArr = [];

  investmentCatArr = [
    {'value':'schoolFees','caption':'Children School Fees'},
    {'value':'mf','caption':'ELSS Mutual Funds'},
    {'value':'epf','caption':'Employee Provident Fund'},
    {'value':'insurance','caption':'LIC / Insurance premium'},
    {'value':'nsc','caption':'National Savings Certificate'},
    {'value':'houseLoanPAmt','caption':'Payment of Principal in Housing Loan'},
    {'value':'ppf','caption':'Personal Provident Fund'},
    {'value':'savingsFD','caption':'Tax Saving Fixed Deposit'},
  ];

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
        //console.log("Current App value "+ this.appService.currentApplicationValue);
        this.userId         = this.authenticationService.currentUserValue.userid;
        if(this.appService.currentApplicationValue != null){
          this.ApplicationId  = this.appService.currentApplicationValue.appId;
        }else{
          this.nextButtonDisable = true;
          this.previousButtonDisable = true;
        }
        
        //console.log("Current App Id "+ this.ApplicationId);
      }
  }

  public uploader: FileUploader = new FileUploader({
    url: URL, 
    itemAlias: 'uploadDeductionProofs'
  });

  ngOnInit() {
    this.mainDeductionForm = this.formBuilder.group({
      itemRows: this.formBuilder.array([this.initItemRows()]),
      selfMedInsPremium:['',Validators.required],
      depHealthCheckupFees:['',Validators.required],
      parentSenCitizenFlag:['',Validators.required],
      parentsMedInsPremium:['',Validators.required],
      savingAccInterest:[''],
      doneeName:[''],
      donAmount:[''],
      doneePan:[''],
      donDeductionLimit:[''],
      donQualPer:[''],
      donAddress:[''],
      donCity:[''],
      donCountry:[''],
      donState:[''],
      donPincode:['']

    });

    this.otherDeductionChkboxForm = this.formBuilder.group({
      section80CCD1: [''],
      section80CCD2: [''],
      section80CCCG:[''],
      section80E: [''],
      section80CCA: [''],
      section80GG: [''],
      section80DDB:[''],
      section80EE: [''],
      section80QQB: [''],
      section80RRB: [''],
      section80GGA:[''],
      section80GGC: [''],
    });

    this.otherDeductionForm = this.formBuilder.group({
      S80CDD1Amount: ['',Validators.required],
      S80CDD2EmprAmount: ['',Validators.required],
      S80CCCGAmount:[''],
      S80EAmount: [''],
      S80CCCAmount: [''],
      S80GGAmount: [''],
      noOfMonthsRentPaid:[''],
      S80DDBAmount: [''],
      personAge: [''],
      S80EEAmount: [''],
      S80QQBAmount:[''],
      S80RRBAmount: [''],
      S80GGAAmount:[''],
      S80GGCAmount: ['']
    });

    this.proofDocUploadForm = this.formBuilder.group({
      //itemUploadDocRows: this.formBuilder.array([]),
      inputGroupFile01: [''],
      inputGroupFile01Pwd: [''],
      investmentProof: ['']
    });

    //this.autoFillMainDeductionForm()

    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };

    this.uploader.onBuildItemForm = (fileItem: any, form: any) => { 
      form.append('UserId', this.userId);
      form.append('ApplicationId', this.ApplicationId);
      form.append('DocCategory', 'InvestmentProofs');
    };

    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
          console.log('ImageUpload:uploaded:', item, status, response);
          console.log('Response '+ response); 
          var res = JSON.parse(response);
          //alert('File uploaded successfully');
          if(res['statusCode'] == 200){                 
            this.alertService.success('File Uploaded successfully');
            this.proofDocUploadForm.get('investmentProof').setValue('1');
          }else{
            this.alertService.error('File Uploading Failed');
          }
    };

  }

  ngAfterViewInit(){
    handleInsideHeaderBackground();
    handleFloatingLabels(Waves);
    formSticky();
	}

  get m() { return this.mainDeductionForm.controls; }
  get o() { return this.otherDeductionForm.controls; }
  get f() { return this.proofDocUploadForm.controls; }

  get section80CformArr() {
    return this.mainDeductionForm.get('itemRows') as FormArray;
  }

  initItemRows() {
    return this.formBuilder.group({
      investmentCategory: ['',Validators.required],
      investmentAmount: ['0',Validators.required]
    });
  }

  addNewRow() {
    this.section80CformArr.push(this.initItemRows());
  }

  deleteRow(index: number) {
    this.section80CformArr.removeAt(index);
  }
  getInvesCatValidity(index: number) {
    return this.section80CformArr.controls[index].get('investmentCategory').errors;
  }
  getInvesAmtValidity(index: number) {
    return this.section80CformArr.controls[index].get('investmentAmount').errors;
  }

  get uploadDocformArr() {
    return this.proofDocUploadForm.get('itemUploadDocRows') as FormArray;
  }
  initDocUploadRows(){
    //for(var i =0;i< this.uploadFieldsArr.length;i++){
      //console.log("Doc Upload Array "+this.uploadFieldsArr.length);
      const _fb = this.formBuilder.group({
        inputGroupFile01: ['',Validators.required],
        inputGroupFile01Pwd: ['']
      });
      ///this.uploadDocformArr.push(_fb);
    //}
    return _fb;
  }

  addNewDocRow() {
      this.uploadDocformArr.push(this.initDocUploadRows());
  }

  findInvalidControls() {
    const invalid = [];
    for(var i=0;i<this.section80CformArr.length;i++){
      const controls = this.section80CformArr.controls[i];
      //for (const name in controls) {
          if (controls.get('investmentCategory').invalid) {
              invalid.push('investmentCategory');
          }
          if (controls.get('investmentAmount').invalid) {
            invalid.push('investmentAmount');
          }
      //}
    }
    
    if(invalid.length > 0)
      return true;
    else
      return false;
 }
  

  /* add investment categories in array so that user cannot select same value */
  onChangeInvestment(event):void{
    const selectInvestmentCategory = event.target.value;
    console.log("Selected Investment category " +selectInvestmentCategory);
    /* this.selectedInvstItems.forEach(val => {
      if(selectInvestmentCategory == val){
        this.setdisable = true;
      }else{
        this.selectedInvstItems.push(selectInvestmentCategory);
        this.setdisable = false;
      }
    }); */
  }

  /* Function to enable/disable & validate file upload form field on Radio change event */
  onChange(event): void {
    const targetChkBox = event.target;
    console.log("Checkbox event & value " +targetChkBox.checked+" - "+targetChkBox.value);

    if (targetChkBox.value == 'section80C') {
      if(targetChkBox.checked){
        this.step1_section80C = true;
      }
      else
        this.step1_section80C = false;
    }
    if (targetChkBox.value == 'section80D') {
      if(targetChkBox.checked){
        this.step1_section80D = true;
        this.mainDeductionForm.get('selfMedInsPremium').setValidators([Validators.required]);
        this.mainDeductionForm.get('depHealthCheckupFees').setValidators([Validators.required]);
        this.mainDeductionForm.get('parentsMedInsPremium').setValidators([Validators.required]);
        this.mainDeductionForm.get('parentSenCitizenFlag').setValidators([Validators.required]);
      }
      else{
        this.step1_section80D = false;
        this.mainDeductionForm.get('selfMedInsPremium').clearValidators();
        this.mainDeductionForm.get('depHealthCheckupFees').clearValidators();
        this.mainDeductionForm.get('parentsMedInsPremium').clearValidators();
        this.mainDeductionForm.get('parentSenCitizenFlag').clearValidators();
      }
      this.mainDeductionForm.get('selfMedInsPremium').updateValueAndValidity();
      this.mainDeductionForm.get('depHealthCheckupFees').updateValueAndValidity();
      this.mainDeductionForm.get('parentsMedInsPremium').updateValueAndValidity();
      this.mainDeductionForm.get('parentSenCitizenFlag').updateValueAndValidity();
      
    }
    if (targetChkBox.value == 'section80TTA') {
      if(targetChkBox.checked){
        this.step1_section80TTA = true;
        this.mainDeductionForm.get('savingAccInterest').setValidators([Validators.required]);
      }
      else{
        this.step1_section80TTA = false;
        this.mainDeductionForm.get('savingAccInterest').clearValidators();
      }
      this.mainDeductionForm.get('savingAccInterest').updateValueAndValidity();
    }
    if (targetChkBox.value == 'section80G') {
      if(targetChkBox.checked){
        this.step1_section80G = true;
        this.mainDeductionForm.get('doneeName').setValidators([Validators.required]);
        this.mainDeductionForm.get('donAmount').setValidators([Validators.required]);
        this.mainDeductionForm.get('doneePan').setValidators([Validators.required]);
        this.mainDeductionForm.get('donDeductionLimit').setValidators([Validators.required]);
        this.mainDeductionForm.get('donQualPer').setValidators([Validators.required]);
        this.mainDeductionForm.get('donAddress').setValidators([Validators.required]);
        this.mainDeductionForm.get('donCity').setValidators([Validators.required]);
        this.mainDeductionForm.get('donCountry').setValidators([Validators.required]);
        this.mainDeductionForm.get('donPincode').setValidators([Validators.required]);
      }
      else{
        this.step1_section80G = false;
        this.mainDeductionForm.get('doneeName').clearValidators();
        this.mainDeductionForm.get('donAmount').clearValidators();
        this.mainDeductionForm.get('doneePan').clearValidators();
        this.mainDeductionForm.get('donDeductionLimit').clearValidators();
        this.mainDeductionForm.get('donQualPer').clearValidators();
        this.mainDeductionForm.get('donAddress').clearValidators();
        this.mainDeductionForm.get('donCity').clearValidators();
        this.mainDeductionForm.get('donCountry').clearValidators();
        this.mainDeductionForm.get('donPincode').clearValidators();
      }
      this.mainDeductionForm.get('doneeName').updateValueAndValidity();
      this.mainDeductionForm.get('donAmount').updateValueAndValidity();
      this.mainDeductionForm.get('doneePan').updateValueAndValidity();
      this.mainDeductionForm.get('donDeductionLimit').updateValueAndValidity();
      this.mainDeductionForm.get('donQualPer').updateValueAndValidity();
      this.mainDeductionForm.get('donAddress').updateValueAndValidity();
      this.mainDeductionForm.get('donCity').updateValueAndValidity();
      this.mainDeductionForm.get('donCountry').updateValueAndValidity();
      this.mainDeductionForm.get('donPincode').updateValueAndValidity();
    }
  }

  /* Function to enable/disable & validate file upload form field on Radio change event */
  onOtherChange(event): void {
    const targetChkBox = event.target;
    console.log("Checkbox event & value " +targetChkBox.checked+" - "+targetChkBox.value);
    if (targetChkBox.value == 'section80CCCG') {
      if(targetChkBox.checked){
        this.step2_section80CCCG = true;
        this.otherDeductionForm.get('S80CCCGAmount').setValidators([Validators.required]);
      }else{
        this.step2_section80CCCG = false;
        this.otherDeductionForm.get('S80CCCGAmount').clearValidators();
      }
      this.otherDeductionForm.get('S80CCCGAmount').updateValueAndValidity();
    }
    
    if (targetChkBox.value == 'section80E') {
      if(targetChkBox.checked){
        this.step2_section80E = true;
        this.otherDeductionForm.get('S80EAmount').setValidators([Validators.required]);
      }else{
        this.step2_section80E = false;
        this.otherDeductionForm.get('S80EAmount').clearValidators();
      }
      this.otherDeductionForm.get('S80EAmount').updateValueAndValidity();
    }
    
    if (targetChkBox.value == 'section80CCC') {
      if(targetChkBox.checked){
        this.step2_section80CCC = true;
        this.otherDeductionForm.get('S80CCCAmount').setValidators([Validators.required]);
      }else{
        this.step2_section80CCC = false;
        this.otherDeductionForm.get('S80CCCAmount').clearValidators();
      }
      this.otherDeductionForm.get('S80CCCAmount').updateValueAndValidity();  
    }
    
    if (targetChkBox.value == 'section80CCD1') {
      if(targetChkBox.checked){
        this.step2_section80CCD1 = true;
        this.otherDeductionForm.get('S80CDD1Amount').setValidators([Validators.required]);
      }else{
        this.step2_section80CCD1 = false;
        this.otherDeductionForm.get('S80CDD1Amount').clearValidators();
      }
      this.otherDeductionForm.get('S80CDD1Amount').updateValueAndValidity();   
    }
    
    if (targetChkBox.value == 'section80CCD2') {
      if(targetChkBox.checked){
        this.step2_section80CCD2 = true;
        this.otherDeductionForm.get('S80CDD2EmprAmount').setValidators([Validators.required]);
      }else{
        this.step2_section80CCD2 = false;
        this.otherDeductionForm.get('S80CDD2EmprAmount').clearValidators();
      }
      this.otherDeductionForm.get('S80CDD2EmprAmount').updateValueAndValidity();
    }
    
    if (targetChkBox.value == 'section80GG') {
      if(targetChkBox.checked){
        this.step2_section80GG = true;
        this.otherDeductionForm.get('S80GGAmount').setValidators([Validators.required]);
        this.otherDeductionForm.get('noOfMonthsRentPaid').setValidators([Validators.required]);
      }else{
        this.step2_section80GG = false;
        this.otherDeductionForm.get('S80GGAmount').clearValidators();
        this.otherDeductionForm.get('noOfMonthsRentPaid').clearValidators();
      }
      this.otherDeductionForm.get('S80GGAmount').updateValueAndValidity();
      this.otherDeductionForm.get('noOfMonthsRentPaid').updateValueAndValidity();
    }

    if (targetChkBox.value == 'section80DDB') {
      if(targetChkBox.checked){
        this.step2_section80DDB = true;
        this.otherDeductionForm.get('S80DDBAmount').setValidators([Validators.required]);
        this.otherDeductionForm.get('personAge').setValidators([Validators.required]);
      }else{
        this.step2_section80DDB = false;
        this.otherDeductionForm.get('S80DDBAmount').clearValidators();
        this.otherDeductionForm.get('personAge').clearValidators();
      }
      this.otherDeductionForm.get('S80DDBAmount').updateValueAndValidity();
      this.otherDeductionForm.get('personAge').updateValueAndValidity();
    }

    if (targetChkBox.value == 'section80EE') {
      if(targetChkBox.checked){
        this.step2_section80EE = true;
        this.otherDeductionForm.get('S80EEAmount').setValidators([Validators.required]);
      }else{
        this.step2_section80EE = false;
        this.otherDeductionForm.get('S80EEAmount').clearValidators();
      }
      this.otherDeductionForm.get('S80EEAmount').updateValueAndValidity();
    }

    if (targetChkBox.value == 'section80QQB') {
      if(targetChkBox.checked){
        this.step2_section80QQB = true;
        this.otherDeductionForm.get('S80QQBAmount').setValidators([Validators.required]);
      }else{
        this.step2_section80QQB = false;
        this.otherDeductionForm.get('S80QQBAmount').clearValidators();
      }
      this.otherDeductionForm.get('S80QQBAmount').updateValueAndValidity();
    }

    if (targetChkBox.value == 'section80RRB') {
      if(targetChkBox.checked){
        this.step2_section80RRB = true;
        this.otherDeductionForm.get('S80RRBAmount').setValidators([Validators.required]);
      }else{
        this.step2_section80RRB = false;
        this.otherDeductionForm.get('S80RRBAmount').clearValidators();
      }
      this.otherDeductionForm.get('S80RRBAmount').updateValueAndValidity();
      
    }
    if (targetChkBox.value == 'section80GGA') {
      if(targetChkBox.checked){
        this.step2_section80GGA = true;
        this.otherDeductionForm.get('S80GGAAmount').setValidators([Validators.required]);
      }else{
        this.step2_section80GGA = false;
        this.otherDeductionForm.get('S80GGAAmount').clearValidators();
      }
      this.otherDeductionForm.get('S80GGAAmount').updateValueAndValidity();
      
    }
    if (targetChkBox.value == 'section80GGC') {
      if(targetChkBox.checked){
        this.step2_section80GGC = true;
        this.otherDeductionForm.get('S80GGCAmount').setValidators([Validators.required]);
      }else{
        this.step2_section80GGC = false;
        this.otherDeductionForm.get('S80GGCAmount').clearValidators();
      }
      this.otherDeductionForm.get('S80GGCAmount').updateValueAndValidity();
      
    }
  }

  autoFillMainDeductionForm(){
    //this.mainDeductionForm.get('uploadForm16FileFlag').setValue("1");
  }

  autoFillOtherDeductionForm(){
    //this.otherDeductionForm.get('uploadOtherIncomeProofFlag').setValue("1");
  }

  autoFillDocUploadForm(){
    //this.proofDocUploadForm.get('uploadHouseIncomeProofFlag').setValue("1");
    // fetch deduction details to create proof doc upload list
    /* this.appService.fetchDeductionDetails(this.userId,this.ApplicationId)
    .pipe(first())
    .subscribe(
      data => {
              //console.log("Response" + JSON.stringify(data));
              if(data['statusCode'] == 200){  
                  if(data['ResultData'] != ""){
                    if(data['ResultData'].length > 0){
                      for(var i=0;i < data['ResultData'].length;i++){
                        console.log("Response" + JSON.stringify(data['ResultData'][i]));
                        //this.uploadFieldsArr.push(data['ResultData'][i]);
                        //this.addNewDocRow();
                      }
                    }
                  }                
              }
          },
      error => {
        this.alertService.error('Application - Not deduction details entered yet '+error);
        this.loading = false;
      }); */
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
      //if (this.findInvalidControls()){
      if(this.mainDeductionForm.invalid) {
          return;
      }else{
        this.onSubmit(this.mainDeductionForm,'mainDeductionDetails');
      }
    }
  }

  onSubmit(formname,infoType) {
    var mainDeductionsParam = [],othDeductionsParam,UploadDeductionsParam; 
    console.log('SUCCESS!! :-)\n\n' + JSON.stringify(formname.value));
    //console.log('SUCCESS1!! :-)\n\n' + JSON.stringify(this.m.itemRows.value));
    switch(infoType){
      case "mainDeductionDetails":
          var section80CArr = this.m.itemRows.value;
          for(var i=0; i< section80CArr.length;i++){
            if(this.step1_section80C){
              var section80C = {
                'appId':this.ApplicationId,
                'userId':this.userId,
                'DeductionType':'Primary',
                'DeductionCat':'Section80C',
                'DeductionAmt':section80CArr[i].investmentAmount,
                'InvestmentCat':section80CArr[i].investmentCategory,
                'SelfMedPremAmt':"",
                'depHCfees':"",
                'parentSCFlag':0,
                'parMedPremAmt':"",
                'DoneeNm':"",
                'DoneePan':"",
                'DonDedLimit':"",
                'DoneeQualPer':"",
                'DonAddress':"",
                'DoneeCity':"",
                'DonCountry':"",
                'DoneeState':0,
                'DonPincode':0,
                'docUploadFlag':'Yes'
              };
              mainDeductionsParam.push(section80C);
            }
          } 
          
          if(this.step1_section80D){
            var section80D = {
              'appId':this.ApplicationId,
              'userId':this.userId,
              'DeductionType':'Primary',
              'DeductionCat':'Section80D',
              'InvestmentCat':"Medical Premium",
              'DeductionAmt':"",
              'SelfMedPremAmt':this.m.selfMedInsPremium.value,
              'depHCfees':this.m.depHealthCheckupFees.value,
              'parentSCFlag':this.m.parentSenCitizenFlag.value,
              'parMedPremAmt':this.m.parentsMedInsPremium.value,
              'DoneeNm':"",
              'DoneePan':"",
              'DonDedLimit':"",
              'DoneeQualPer':"",
              'DonAddress':"",
              'DoneeCity':"",
              'DonCountry':"",
              'DoneeState':0,
              'DonPincode':0,
              'docUploadFlag':'Yes'
            };
            mainDeductionsParam.push(section80D);
          }

          if(this.step1_section80TTA){
            var section80TTA = {
              'appId':this.ApplicationId,
              'userId':this.userId,
              'DeductionType':'Primary',
              'DeductionCat':'Section80TTA',
              'DeductionAmt':this.m.savingAccInterest.value,
              'InvestmentCat':'SavingBankInterest',
              'SelfMedPremAmt':"",
              'depHCfees':"",
              'parentSCFlag':0,
              'parMedPremAmt':"",
              'DoneeNm':"",
              'DoneePan':"",
              'DonDedLimit':"",
              'DoneeQualPer':"",
              'DonAddress':"",
              'DoneeCity':"",
              'DonCountry':"",
              'DoneeState':0,
              'DonPincode':0,
              'docUploadFlag':'Yes'
            };
            mainDeductionsParam.push(section80TTA);
          }

          if(this.step1_section80G){
            var section80G = {
              'appId':this.ApplicationId,
              'userId':this.userId,
              'DeductionType':'Primary',
              'DeductionCat':'section80G',
              'InvestmentCat':'Donations',
              'DeductionAmt':this.m.donAmount.value,
              'SelfMedPremAmt':"",
              'depHCfees':"",
              'parentSCFlag':0,
              'parMedPremAmt':"",
              'DoneeNm':this.m.doneeName.value,
              'DoneePan':this.m.doneePan.value,
              'DonDedLimit':this.m.donDeductionLimit.value,
              'DoneeQualPer':this.m.donQualPer.value,
              'DonAddress':this.m.donAddress.value,
              'DoneeCity':this.m.donCity.value,
              'DonCountry':this.m.donCountry.value,
              'DoneeState':this.m.donState.value,
              'DonPincode':this.m.donPincode.value,
              'docUploadFlag':'Yes'
            };
            mainDeductionsParam.push(section80G);
          }
          console.log("Final Param "+ JSON.stringify(mainDeductionsParam));
          //this.submittedData.push({"MainDeductionData":mainDeductionsParam});
          // start storing main deduction data in database
          this.appService.saveDeductionsDetails(mainDeductionsParam)
          .pipe(first())
          .subscribe(
            data => {
                    console.log("Response" + JSON.stringify(data));
                    //successfully inserted
                    if(data['statusCode'] == 200){                  
                        this.alertService.success('Application - Main deductions data saved successfully');
                        this.localStoreg['applicationStage'] = 15;
                        //console.log("LocalStore" + JSON.stringify(this.localStoreg));
                        localStorage.removeItem("currentUserApp");
                        localStorage.setItem("currentUserApp", JSON.stringify(this.localStoreg));
                        this.loading = false;
                        this.step1 = false;
                        this.step2 = true;
                        this.step3 = false;

                        //this.autoFillOtherDeductionForm();
                    }
                },
            error => {
              this.alertService.error('Application - Main deductions data save request failed '+error);
              this.loading = false;
            });
      break;
      case "otherDeductionsDetails":
        if(this.step2_section80CCD1){
          othDeductionsParam = {
            'appId':this.ApplicationId,
            'userId':this.userId,
            'DeductionType':'Others',
            'DeductionCat':'Section80CCD1',
            'DeductionAmt':this.o.S80CDD1Amount.value,
            'RentPerMonth':"",
            "TreatAge":"",
            'InvestmentCat':"Self_NPS",
            'docUploadFlag':"Yes"
          };
          mainDeductionsParam.push(othDeductionsParam);
        }

        if(this.step2_section80CCD2){
          othDeductionsParam = {
            'appId':this.ApplicationId,
            'userId':this.userId,
            'DeductionType':'Others',
            'DeductionCat':'Section80CCD2',
            'DeductionAmt':this.o.S80CDD2EmprAmount.value,
            'RentPerMonth':"",
            "TreatAge":"",
            'InvestmentCat':"EMPR_NPS",
            'docUploadFlag':"Yes"
          };
          mainDeductionsParam.push(othDeductionsParam);
        }

        if(this.step2_section80CCCG){
          othDeductionsParam = {
            'appId':this.ApplicationId,
            'userId':this.userId,
            'DeductionType':'Others',
            'DeductionCat':'Section80CCG',
            'DeductionAmt':this.o.S80CCCGAmount.value,
            'RentPerMonth':"",
            "TreatAge":"",
            'InvestmentCat':"RajivGFund",
            'docUploadFlag':"Yes"
          };
          mainDeductionsParam.push(othDeductionsParam);
        }

        if(this.step2_section80E){
          othDeductionsParam = {
            'appId':this.ApplicationId,
            'userId':this.userId,
            'DeductionType':'Others',
            'DeductionCat':'Section80E',
            'DeductionAmt':this.o.S80EAmount.value,
            'RentPerMonth':"",
            "TreatAge":"",
            'InvestmentCat':"EDU_Loan_Interest",
            'docUploadFlag':"Yes"
          };
          mainDeductionsParam.push(othDeductionsParam);
        }

        if(this.step2_section80CCC){
          othDeductionsParam = {
            'appId':this.ApplicationId,
            'userId':this.userId,
            'DeductionType':'Others',
            'DeductionCat':'Section80CCC',
            'DeductionAmt':this.o.S80CCCAmount.value,
            'RentPerMonth':"",
            "TreatAge":"",
            'InvestmentCat':"Pension_Plan",
            'docUploadFlag':"Yes"
          };
          mainDeductionsParam.push(othDeductionsParam);
        }

        if(this.step2_section80GG){
          othDeductionsParam = {
            'appId':this.ApplicationId,
            'userId':this.userId,
            'DeductionType':'Others',
            'DeductionCat':'Section80GG',
            'DeductionAmt':this.o.S80GGAmount.value,
            'RentPerMonth':this.o.noOfMonthsRentPaid.value,
            "TreatAge":"",
            'InvestmentCat':"House_Rent",
            'docUploadFlag':"Yes"
          };
          mainDeductionsParam.push(othDeductionsParam);
        }

        if(this.step2_section80DDB){
          othDeductionsParam = {
            'appId':this.ApplicationId,
            'userId':this.userId,
            'DeductionType':'Others',
            'DeductionCat':'Section80DDB',
            'DeductionAmt':this.o.S80DDBAmount.value,
            'RentPerMonth':"",
            "TreatAge":this.o.personAge.value,
            'InvestmentCat':"Medical_Treatmnt",
            'docUploadFlag':"Yes"
          };
          mainDeductionsParam.push(othDeductionsParam);
        }

        if(this.step2_section80EE){
          othDeductionsParam = {
            'appId':this.ApplicationId,
            'userId':this.userId,
            'DeductionType':'Others',
            'DeductionCat':'Section80EE',
            'DeductionAmt':this.o.S80EEAmount.value,
            'RentPerMonth':"",
            "TreatAge":"",
            'InvestmentCat':"FirstHouseLoan_Interest",
            'docUploadFlag':"Yes"
          };
          mainDeductionsParam.push(othDeductionsParam);
        }

        if(this.step2_section80QQB){
          othDeductionsParam = {
            'appId':this.ApplicationId,
            'userId':this.userId,
            'DeductionType':'Others',
            'DeductionCat':'Section80QQB',
            'DeductionAmt':this.o.S80QQBAmount.value,
            'RentPerMonth':"",
            "TreatAge":"",
            'InvestmentCat':"Royality",
            'docUploadFlag':"Yes"
          };
          mainDeductionsParam.push(othDeductionsParam);
        }

        if(this.step2_section80RRB){
          othDeductionsParam = {
            'appId':this.ApplicationId,
            'userId':this.userId,
            'DeductionType':'Others',
            'DeductionCat':'Section80RRB',
            'DeductionAmt':this.o.S80RRBAmount.value,
            'RentPerMonth':"",
            "TreatAge":"",
            'InvestmentCat':"Patentee",
            'docUploadFlag':"Yes"
          };
          mainDeductionsParam.push(othDeductionsParam);
        }

        if(this.step2_section80GGA){
          othDeductionsParam = {
            'appId':this.ApplicationId,
            'userId':this.userId,
            'DeductionType':'Others',
            'DeductionCat':'Section80GGA',
            'DeductionAmt':this.o.S80GGAAmount.value,
            'RentPerMonth':"",
            "TreatAge":"",
            'InvestmentCat':"Research_Contri",
            'docUploadFlag':"Yes"
          };
          mainDeductionsParam.push(othDeductionsParam);
        }

        if(this.step2_section80GGC){
          othDeductionsParam = {
            'appId':this.ApplicationId,
            'userId':this.userId,
            'DeductionType':'Others',
            'DeductionCat':'Section80GGC',
            'DeductionAmt':this.o.S80GGCAmount.value,
            'RentPerMonth':"",
            "TreatAge":"",
            'InvestmentCat':"PoliticalParty",
            'docUploadFlag':"Yes"
          };
          mainDeductionsParam.push(othDeductionsParam);
        }
        
        console.log("Final Param "+ JSON.stringify(mainDeductionsParam));
        // start storing application data in database
        this.appService.saveOtherDeductionsDetails(mainDeductionsParam)
        .pipe(first())
        .subscribe(
          data => {
                  console.log("Response" + JSON.stringify(data));
                  //successfully inserted
                  if(data['statusCode'] == 200){                  
                      this.alertService.success('Application - Other Deductions data saved successfully');
                      this.localStoreg['applicationStage'] = 16;
                      //console.log("LocalStore" + JSON.stringify(this.localStoreg));
                      localStorage.removeItem("currentUserApp");
                      localStorage.setItem("currentUserApp", JSON.stringify(this.localStoreg));
                      this.loading = false;
                      this.step1 = false;
                      this.step2 = false;
                      this.step3 = true;
                  }
              },
          error => {
              this.alertService.error('Application - OtherIncome data save request failed '+error);
              this.loading = false;
          });
      break;

      case "docUploadDetails":
        this.localStoreg['applicationStage'] = 17;
        //console.log("LocalStore" + JSON.stringify(this.localStoreg));
        localStorage.removeItem("currentUserApp");
        localStorage.setItem("currentUserApp", JSON.stringify(this.localStoreg));
        this.loading = false;
        this.router.navigate(['taxfilling/taxpaid']);
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
