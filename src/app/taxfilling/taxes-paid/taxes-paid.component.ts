import { Component, OnInit,AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { handleInsideHeaderBackground,handleFloatingLabels,formSticky } from '../../app.helpers';
import * as Waves from 'node-waves';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  otherTaxesPaidForm: FormGroup;
  loading = false;

  //flag to check submitted event on each subform
  docSubmitted = false;
  taxSubmitted = false;

  //initilize & activate flag to by default active salaryIncome tab
  step1:boolean = true;
  step2:boolean = false;

  //initilize & activate flag to by default active otherIncome subtab
  step2_challanDetails_data :boolean = true;
  step2_other_taxespaid:boolean = false;

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

    this.otherTaxesPaidForm = this.formBuilder.group({
      inpBSRCode : [''],
      inpChallanPaymentDate : [''],
      inpChallanNumber : [''],
      inpChallanAmount : [''],

      inpTaxDedName : [''],
      inpTaxDedTAN : [''],
      inpTaxReceiptNumber : [''],
      inpPaidYear : [''],
      inpTaxForAmt : [''],
      inpTaxPaidAmt: ['']
    })

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
	}
  
  get d() { return this.upload26ASForm.controls; }
  get o() { return this.otherTaxesPaidForm.controls; }

  //Function Called on next button click
  on_next_click(){
    if (this.step2 == true) {
      this.taxSubmitted = true;
      this.loading = true;
      console.log("Other Tax details submitted");
      // stop here if form is invalid
      if (this.otherTaxesPaidForm.invalid) {
        this.alertService.error('Please enter all fields in both tabs');
        return;
      }else{
        this.onSubmit(this.otherTaxesPaidForm,'otherTaxDetails');
      }
    }
    
    if (this.step1 == true) {
      this.docSubmitted = true;
      this.loading = true;
      this.previousButtonDisable = false;
      console.log("26AS details submitted");
      // stop here if form is invalid
      if (this.upload26ASForm.invalid) {
        this.alertService.error('Please enter all fields in both tabs');
        return;
      }else{
        this.onSubmit(this.upload26ASForm,'doc26ASDetails');
      }
    }
  }

  onSubmit(formname,infoType) {
    var othTaxDetailsParam;  
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
      break;

      case "otherTaxDetails":
        othTaxDetailsParam = {
          'appId':this.ApplicationId,
          'userId':this.userId,
          "doc26ASUploadFlag":this.d.upload26ASFileFlag.value,
          "inpBSRCode" : this.o.inpBSRCode.value,
          "inpChallanPaymentDate" : this.o.inpChallanPaymentDate.value,
          "inpChallanNumber" : this.o.inpChallanNumber.value,
          "inpChallanAmount" : this.o.inpChallanAmount.value,
          "inpTaxDedName" : this.o.inpTaxDedName.value,
          "inpTaxDedTAN" : this.o.inpTaxDedTAN.value,
          "inpTaxReceiptNumber" : this.o.inpTaxReceiptNumber.value,
          "inpPaidYear" : this.o.inpPaidYear.value,
          "inpTaxForAmt" : this.o.inpTaxForAmt.value,
          "inpTaxPaidAmt": this.o.inpTaxPaidAmt.value
        };

        // start storing application data in database
        this.appService.saveTaxexPaidDetails(othTaxDetailsParam)
        .pipe(first())
        .subscribe(
          data => {
                  console.log("Response" + JSON.stringify(data));
                  //successfully inserted
                  if(data['statusCode'] == 200){
                    this.alertService.error('Application - Taxes paid data saved successfully');
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
  on_previous_click(){
    if (this.step2 == true) {
      this.step1 = true;
      this.step2 = false;
      this.previousButtonDisable = true;
    }
  }

  //Function to enable forms from naviagtion icons
  select_form_step(a){
    if(a == 'step1'){
      this.step1 = true;
      this.step2 = false;
    }
    if(a == 'step2'){
      this.step1 = false;
      this.step2 = true;
      this.previousButtonDisable = false;
    }
  }

  select_step2_subpart_form(x){
    if(x == 'income_other_upload'){
      this.step2_challanDetails_data = true;
      this.step2_other_taxespaid = false;
    }
    if(x == 'income_other_data'){
      this.step2_challanDetails_data = false;
      this.step2_other_taxespaid = true;
    }
  }

}
