import { Component, OnInit,AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { handleInsideHeaderBackground,handleFloatingLabels,formSticky, getFileSizeNameAndType } from '../../app.helpers';
import * as Waves from 'node-waves';
import { FormBuilder, FormGroup, Validators,FormArray } from '@angular/forms';
import { first } from 'rxjs/operators';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { environment } from '@environments/environment';
import { AuthenticationService,ApplicationService, AlertService } from '@app/_services';


const URL = `${environment.apiUrl}/tax/uploadproofDocuments`;

@Component({
  selector: 'app-taxes-paid',
  templateUrl: './taxes-paid.component.html',
  styleUrls: ['./taxes-paid.component.css']
})
export class TaxesPaidComponent implements OnInit,AfterViewInit {

  upload26ASForm: FormGroup;
  otherTaxesPaidChallanForm: FormGroup;
  otherIncomeTaxesPaidForm: FormGroup;
  IncomeTaxesPaidForm: FormGroup;
  items: FormArray;
  loading = false;

  //flag to check submitted event on each subform
  docSubmitted = false;
  taxSubmitted = false;
  othTaxSubmitted = false;
  incTaxSubmitted = false;

  //initilize & activate flag to by default active salaryIncome tab
  step1:boolean = true;
  step2:boolean = false;

  //initilize & activate flag to by default active otherIncome subtab
  step2_challanDetails_data :boolean = true;
  step2_other_taxespaid:boolean = false;
  step2_income_taxespaid:boolean = false;

  //Global variables to save userdId and ApplictionID
  userId : number;
  ApplicationId : number;
  nextButtonDisable = false;
  previousButtonDisable = false;

  //Read localstorage in progress application values
  localStoreg = JSON.parse(localStorage.getItem("currentUserApp"));

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
    itemAlias: 'upload26ASProofs'
  });

  ngOnInit() {
    this.upload26ASForm = this.formBuilder.group({
      upload26ASFile: [''],
      upload26ASFilePassword: [''],
      upload26ASFileFlag:['0']
    });

    this.otherTaxesPaidChallanForm = this.formBuilder.group({
      itemRows: this.formBuilder.array([this.initItemRows()]),
    });

    this.otherIncomeTaxesPaidForm = this.formBuilder.group({
      inpTDSBelongsTo:[''],
      inpTaxDedName : ['',
        [ 
          Validators.maxLength(150),
          Validators.pattern('^[a-zA-Z ]*$')
        ],
      ],
      inpTaxDedTAN : ['',
        [
          Validators.maxLength(10),
          Validators.pattern("^([A-Z]{4}[0-9]{5}[A-Z])*$")
        ],
      ],
      inpTaxReceiptNumber : ['',
        [
          Validators.minLength(6),
          Validators.maxLength(8),
        ],
      ],
      inpUnclaimedTDSYr:[''],
      inpUnclaimedTDSAmt : ['',
        [ 
          Validators.pattern("^[0-9]+(.[0-9]{0,2})?$")
        ],
      ],
      inpAmtClaimedCurrYr : ['',
        [ 
          Validators.pattern("^[0-9]+(.[0-9]{0,2})?$")
        ],
      ],
      inpTaxDedAmtFromRel: ['',
        [ 
          Validators.pattern("^[0-9]+(.[0-9]{0,2})?$")
        ],
      ],
      inpTaxCrditCarryFwd: ['',
        [ 
          Validators.pattern("^[0-9]+(.[0-9]{0,2})?$")
        ],
      ]
    });

    this.IncomeTaxesPaidForm = this.formBuilder.group({
      inpIncomeTaxDedName : ['',
        [ 
          Validators.maxLength(150),
          Validators.pattern('^[a-zA-Z ]*$')
        ],
      ],
      inpIncomeTaxDedTAN : ['',
        [
          Validators.maxLength(10),
          Validators.pattern("^([A-Z]{4}[0-9]{5}[A-Z])*$")
        ],
      ],
      inpIncomeChargeUSal : ['',
        [ 
          Validators.pattern("^[0-9]+(.[0-9]{0,2})?$")
        ],
      ],
      inpIncomeTaxDeducted : ['',
        [ 
          Validators.pattern("^[0-9]+(.[0-9]{0,2})?$")
        ],
      ]
    });

    

    //File Uploader with form data
    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };

    this.uploader.onBuildItemForm = (fileItem: any, form: any) => { 
      form.append('UserId', this.userId);
      form.append('ApplicationId', this.ApplicationId);
      form.append('DocCategory', '26ASDoc');
      form.append('FilePassword', this.upload26ASForm.get('upload26ASFilePassword').value);
    };

    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
          console.log('ImageUpload:uploaded:', item, status, response);
          console.log('Response '+ response); 
          var res = JSON.parse(response);
          //alert('File uploaded successfully');
          if(res['statusCode'] == 200){                 
            this.alertService.success('File Uploaded successfully');
            this.upload26ASForm.get('upload26ASFileFlag').setValue('1');
          }else{
            this.alertService.error('File Uploading Failed');
          }
    };
  }

  ngAfterViewInit(){
    handleInsideHeaderBackground();
    handleFloatingLabels(Waves);
    formSticky();
    getFileSizeNameAndType();
	}
  
  get d() { return this.upload26ASForm.controls; }
  get c() { return this.otherTaxesPaidChallanForm.controls; }
  get o() { return this.otherIncomeTaxesPaidForm.controls; }
  get i() { return this.IncomeTaxesPaidForm.controls; }

  initItemRows() {
    return this.formBuilder.group({
      inpBSRCode : ['',
        [
          Validators.maxLength(7),
          Validators.pattern("^[0-9]*$"),
        ],
      ],
      inpChallanPaymentDate : [''],
      inpChallanNumber : ['',
        [
          Validators.maxLength(5),
          Validators.pattern("^[0-9]*$"),
        ],
      ],
      inpChallanAmount : ['',
        [ 
          Validators.pattern("^[0-9]+(.[0-9]{0,2})?$")
        ],
      ]
    });
  }

  get addChallanDetailsformArr() {
    return this.otherTaxesPaidChallanForm.get('itemRows') as FormArray;
  }

  addNewRow() {
    this.addChallanDetailsformArr.push(this.initItemRows());
  }

  deleteRow(index: number) {
    this.addChallanDetailsformArr.removeAt(index);
  }

  getBSRValidity(index:number){
    return this.addChallanDetailsformArr.controls[index].get('inpBSRCode').errors;
  }

  getChallanNoValidity(index:number){
    return this.addChallanDetailsformArr.controls[index].get('inpChallanNumber').errors;
  }

  getChallanAmtValidity(index:number){
    return this.addChallanDetailsformArr.controls[index].get('inpChallanAmount').errors;
  }

  //Function Called on next button click
  on_next_click(a){
    switch(a){
      case "step1":
        this.docSubmitted = true;
        this.loading = true;
        console.log("26AS details submitted");
        // stop here if form is invalid
        if (this.upload26ASForm.invalid) {
          this.loading = false;
          return;
        }else{
          this.onSubmit(this.upload26ASForm,'doc26ASDetails');
        }
      break;

      case "step2_challanDetails_data":
        this.taxSubmitted = true;
        this.loading = true;
        console.log("Other Tax details submitted");
        // stop here if form is invalid
        if (this.otherTaxesPaidChallanForm.invalid) {
          this.loading = false;
          return;
        }else{
          this.onSubmit(this.otherTaxesPaidChallanForm,'challanTaxDetails');
        }
      break;
      case "step2_other_taxespaid":
        this.othTaxSubmitted = true;
        this.loading = true;
        console.log("Other Tax details submitted");
        // stop here if form is invalid
        if (this.otherIncomeTaxesPaidForm.invalid) {
          this.loading = false;
          return;
        }else{
          this.onSubmit(this.otherIncomeTaxesPaidForm,'othIncomeTaxDetails');
        }
      break;
      
      case "step2_income_taxespaid":
        this.incTaxSubmitted = true;
        this.loading = true;
        console.log("Income Taxpaid details submitted");
        // stop here if form is invalid
        if (this.IncomeTaxesPaidForm.invalid) {
          this.loading = false;
          return;
        }else{
          this.onSubmit(this.IncomeTaxesPaidForm,'incomeTaxDetails');
        }
      break;
    }
  }

  onSubmit(formname,infoType) {
    console.log('SUCCESS!! :-)\n\n' + JSON.stringify(formname.value));
    switch(infoType){
      case "doc26ASDetails":
        this.localStoreg['applicationStage'] = 18;
        //console.log("LocalStore" + JSON.stringify(this.localStoreg));
        localStorage.removeItem("currentUserApp");
        localStorage.setItem("currentUserApp", JSON.stringify(this.localStoreg));
        this.loading = false;
        this.step1 = false;
        this.step2 = true;
        this.step2_challanDetails_data = true;
        this.step2_other_taxespaid = false;
        this.step2_income_taxespaid = false;
      break;

      case "challanTaxDetails":
        var details = [];
        var addChallanDetails = this.c.itemRows.value;
        if(addChallanDetails.length > 0 ){
          for(var i=0; i< addChallanDetails.length;i++){
            if(addChallanDetails[i].inpBSRCode != ""){
              var challanObj = {
                "bsrcode":addChallanDetails[i].inpBSRCode,
                "challanpaydate":addChallanDetails[i].inpChallanPaymentDate,
                "challannum":addChallanDetails[i].inpChallanNumber,
                "challanamt":addChallanDetails[i].inpChallanAmount
              }
              details.push(challanObj);
            }
          }
        } 
        var othTaxDetailsParam = {
          'appId':this.ApplicationId,
          'userId':this.userId,
          'Details':details
        };

        // start storing application data in database
        this.appService.saveTaxexPaidDetails(othTaxDetailsParam)
        .pipe(first())
        .subscribe(
          data => {
                  console.log("Response" + JSON.stringify(data));
                  //successfully inserted
                  if(data['statusCode'] == 200){
                    this.alertService.success('Application - Taxes paid data saved successfully');
                    this.localStoreg['applicationStage'] = 18;
                    //console.log("LocalStore" + JSON.stringify(this.localStoreg));
                    localStorage.removeItem("currentUserApp");
                    localStorage.setItem("currentUserApp", JSON.stringify(this.localStoreg));
                    this.loading = false;
                    this.step1 = false;
                    this.step2 = true;
                    this.step2_challanDetails_data = false;
                    this.step2_other_taxespaid = true;
                    this.step2_income_taxespaid = false;
                  }                
              },
          error => {
              this.alertService.error('Application - Taxes paid data save request failed '+error);
              this.loading = false;
          });
      break;

      case "othIncomeTaxDetails":
        var othIncTaxDetailsParam = {
          'appId':this.ApplicationId,
          'userId':this.userId,
          'taxCreditBelongsTo':this.o.inpTDSBelongsTo.value,
          'taxDedName':this.o.inpTaxDedName.value,
          'taxDedTAN':this.o.inpTaxDedTAN.value,
          'taxCertiNumber':this.o.inpTaxReceiptNumber.value,
          'UnclaimedTDSYr':this.o.inpUnclaimedTDSYr.value,
          'UnclaimedTDSAmt':this.o.inpUnclaimedTDSAmt.value,
          'AmtClaimedCurrYr':this.o.inpAmtClaimedCurrYr.value,
          'TDSDedFromReln':this.o.inpTaxDedAmtFromRel.value,
          'taxCreditCarryFwd':this.o.inpTaxCrditCarryFwd.value,
        };

        // start storing application data in database
        this.appService.saveOtherTaxexPaidDetails(othIncTaxDetailsParam)
        .pipe(first())
        .subscribe(
          data => {
                  console.log("Response" + JSON.stringify(data));
                  //successfully inserted
                  if(data['statusCode'] == 200){
                    this.alertService.success('Application - Taxes paid data saved successfully');
                    this.localStoreg['applicationStage'] = 18;
                    //console.log("LocalStore" + JSON.stringify(this.localStoreg));
                    localStorage.removeItem("currentUserApp");
                    localStorage.setItem("currentUserApp", JSON.stringify(this.localStoreg));
                    this.loading = false;
                    this.step1 = false;
                    this.step2 = true;
                    this.step2_challanDetails_data = false;
                    this.step2_other_taxespaid = false;
                    this.step2_income_taxespaid = true;
                  }                
              },
          error => {
              this.alertService.error('Application - Taxes paid data save request failed '+error);
              this.loading = false;
          });
      break;
      case "incomeTaxDetails":
        var IncTaxDetailsParam = {
          'appId':this.ApplicationId,
          'userId':this.userId,
          'taxDedName':this.i.inpIncomeTaxDedName.value,
          'taxDedTAN':this.i.inpIncomeTaxDedTAN.value,
          'incomeChargeUSal':this.i.inpIncomeChargeUSal.value,
          'totaltaxDeducted':this.i.inpIncomeTaxDeducted.value
        };

        // start storing application data in database
        this.appService.saveIncomeTaxexPaidDetails(IncTaxDetailsParam)
        .pipe(first())
        .subscribe(
          data => {
                  console.log("Response" + JSON.stringify(data));
                  //successfully inserted
                  if(data['statusCode'] == 200){
                    this.alertService.success('Application - Taxes paid data saved successfully');
                    this.localStoreg['applicationStage'] = 18;
                    //console.log("LocalStore" + JSON.stringify(this.localStoreg));
                    localStorage.removeItem("currentUserApp");
                    localStorage.setItem("currentUserApp", JSON.stringify(this.localStoreg));
                    this.loading = false;
                    this.router.navigate(['taxfilling/review']);
                  }                
              },
          error => {
              this.alertService.error('Application - Taxes paid data save request failed '+error);
              this.loading = false;
          });
      break;
    }
  }

  //Function Called on previous button click
  on_previous_click(a){
    switch(a){
      case "step1":
        this.router.navigate(['taxfilling/deductions']);
      break;

      case "step2_challanDetails_data":
        this.step1 = true;
        this.step2 = false;
        this.step2_challanDetails_data = false;
        this.step2_other_taxespaid = false;
        this.step2_income_taxespaid = false;
      break;

      case "step2_other_taxespaid":
        this.step1 = false;
        this.step2 = true;
        this.step2_challanDetails_data = true;
        this.step2_other_taxespaid = false;
        this.step2_income_taxespaid = false;
      break;

      case "step2_income_taxespaid":
        this.step1 = false;
        this.step2 = true;
        this.step2_challanDetails_data = false;
        this.step2_other_taxespaid = true;
        this.step2_income_taxespaid = false;
      break;
    }
  }

  on_skip_click(a){
    switch(a){
      case "step1":
        this.step1 = false;
        this.step2 = true;
        this.step2_challanDetails_data = true;
        this.step2_other_taxespaid = false;
        this.step2_income_taxespaid = false;
      break;

      case "step2_challanDetails_data":
        this.step1 = false;
        this.step2 = true;
        this.step2_challanDetails_data = false;
        this.step2_other_taxespaid = true;
        this.step2_income_taxespaid = false;
      break;
      case "step2_other_taxespaid":
        this.step1 = false;
        this.step2 = true;
        this.step2_challanDetails_data = false;
        this.step2_other_taxespaid = false;
        this.step2_income_taxespaid = true;
      break;
      
      case "step2_income_taxespaid":
        this.localStoreg['applicationStage'] = 18;
        localStorage.removeItem("currentUserApp");
        localStorage.setItem("currentUserApp", JSON.stringify(this.localStoreg));
        this.router.navigate(['taxfilling/review']);
      break;
    }
  }

  //Function Called on Reset button click
  on_reset_click(a){
    switch(a){
      case "step1":
        this.upload26ASForm.reset();
      break;

      case "step2_challanDetails_data":
      this.otherTaxesPaidChallanForm.reset();
      break;

      case "step2_other_taxespaid":
        this.otherIncomeTaxesPaidForm.reset();
      break;

      case "step2_income_taxespaid":
      this.IncomeTaxesPaidForm.reset();
      break;
    }
  }

  //Function to enable forms from naviagtion icons
  select_form_step(a){
    if(a == 'step1'){
      this.step1 = true;
      this.step2 = false;
      this.step2_challanDetails_data = false;
      this.step2_other_taxespaid = false;
      this.step2_income_taxespaid = false;
    }
    if(a == 'step2'){
      this.step1 = false;
      this.step2 = true;
      this.step2_challanDetails_data = true;
      this.step2_other_taxespaid = false;
      this.step2_income_taxespaid = false;
    }
  }

  select_step2_subpart_form(x){
    if(x == 'challanDetails'){
      this.step2_challanDetails_data = true;
      this.step2_other_taxespaid = false;
      this.step2_income_taxespaid = false;
    }
    if(x == 'other_taxespaid'){
      this.step2_challanDetails_data = false;
      this.step2_other_taxespaid = true;
      this.step2_income_taxespaid = false;
    }
    if(x == 'income_taxespaid'){
      this.step2_challanDetails_data = false;
      this.step2_other_taxespaid = false;
      this.step2_income_taxespaid = true;
    }
  }

}
