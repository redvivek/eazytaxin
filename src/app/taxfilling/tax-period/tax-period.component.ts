import { Component, OnInit,AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { FileSelectDirective, FileDropDirective, FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { environment } from '@environments/environment';
import { ApplicationMain} from '@app/_models';
import { ScriptService,AlertService, AuthenticationService,ApplicationService } from '@app/_services';
import { handleInsideHeaderBackground,handleFloatingLabels } from '../../app.helpers';
import * as Waves from 'node-waves';

const URL = `${environment.apiUrl}/tax/uploadxml`;

@Component({
  selector: 'app-tax-period',
  templateUrl: './tax-period.component.html',
  styleUrls: ['./tax-period.component.css']
})
export class TaxPeriodComponent implements OnInit,AfterViewInit {
  taxPeriodForm: FormGroup;
  loading = false;
  submitted = false;
  showUploadField = false;
  userId : number;
  ApplicationId : number;
  selAssYear : any = null;
  //dataSubmitted = false;

  taxperiods = this.getCurrentAssesmentYear();

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private appservice: ApplicationService,
    private alertService: AlertService,
    private scriptservice : ScriptService
  )
  {
    // redirect to login if not logged in
    if (!this.authenticationService.currentUserValue) { 
      this.router.navigate(['/login']);
    }else{
      console.log("Current user value "+ JSON.stringify(this.authenticationService.currentUserValue));
      this.userId = this.authenticationService.currentUserValue.userid;
    }

    if(this.appservice.currentApplicationValue != null){
        this.selAssYear = this.appservice.currentApplicationValue.taxperiod;
    }else{
      this.selAssYear = this.taxperiods[0]
    }
  }

  public uploader: FileUploader = new FileUploader({
    url: URL, 
    itemAlias: 'uploadPreFillXMLFile'
  });

  ngOnInit() {
    this.taxPeriodForm = this.formBuilder.group({
        taxperiod: ['', Validators.required],
        xmluploadflag : ['',Validators.required],
        uploadPreFillXMLFile : [null]
    });

    //Preload form with existing or default values
    this.taxPeriodForm.get('taxperiod').setValue(this.selAssYear);
    this.taxPeriodForm.get('xmluploadflag').setValue('0');

    //call this to enable/disable & validate file upload form field on Radio change event
    this.formControlValueChanged();
    
    //XML File Uploader with form data
    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
    
    this.uploader.onBuildItemForm = (fileItem: any, form: any) => {
      var randomNo = "App"+this.generateAppRefNo(this.userId);  
      form.append('AppRefNo', randomNo); //note comma separating key and value
      form.append('UserId', this.userId);
      form.append('AssesmentYear', this.selAssYear);
      form.append('XmlUploadFlag', 1);
      form.append('ApplicationStatus', 'Initiated');
      form.append('DocCategory', 'PreUploadXML');
     };

    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
        //console.log('ImageUpload:uploaded:', item, status, response);
        console.log('Response '+ response); 
        var res = JSON.parse(response);
        //alert('File uploaded successfully');
        if(res['statusCode'] == 200){                 
            this.alertService.success('Prefilled XML File Uploaded successfully');
            localStorage.removeItem("currentUserApp");
            //Add newly created AppID in local storage
            const appdata:ApplicationMain = { 
                'appId': res['AppId'],
                'taxperiod':this.selAssYear,
                'xmluploadflag':1, 
                'appRefno':"", 
                'applicationStage':1, 
                'appStatus':'initiated' 
            };
            localStorage.setItem("currentUserApp", JSON.stringify(appdata));
            //this.dataSubmitted = true;
            this.loading = false;
        }else{
            this.alertService.error('Prefilled XML File Upload Failed');
        }
    };
    /*XML File Uploader with form data ends here */
  }

  ngAfterViewInit(){
    handleInsideHeaderBackground();
    handleFloatingLabels(Waves);
	}

  // convenience getter for easy access to form fields
  get f() { return this.taxPeriodForm.controls; }

  /* Function to enable/disable & validate file upload form field on Radio change event */
  formControlValueChanged() {
    const xmlFileUpload = this.taxPeriodForm.get('uploadPreFillXMLFile');

    this.taxPeriodForm.get('xmluploadflag').valueChanges.subscribe(
      (mode: boolean) => {
        console.log(mode);
        if (mode == true) {
          this.showUploadField = true;
          xmlFileUpload.setValidators([Validators.required]);
        }
        else {
          this.showUploadField = false;
          xmlFileUpload.clearValidators();
        }
        xmlFileUpload.updateValueAndValidity();
    });
  }

  /*Function called on Next Button. Saves data to table if there is no file upload */
  onSubmit() {
    this.submitted = true;
    this.loading = true;
    // stop here if form is invalid
    if (this.taxPeriodForm.invalid) {
        return;
    }

    this.ApplicationId  = this.appservice.currentApplicationValue.appId;
    console.log("Current App Id "+ this.ApplicationId);
    if(this.ApplicationId == null){
        var randomNo = "App"+this.generateAppRefNo(this.userId);
        
        console.log('Input Values :-)\n\n' + JSON.stringify(this.taxPeriodForm.value));
        //create the input params for post request
        const appData = {
            'userId':this.userId,
            'taxperiod' : this.f.taxperiod.value,
            'xmluploadflag':this.f.xmluploadflag.value,
            'appRefNo': randomNo
        };
        // start storing application data in database
        this.appservice.createApplication(appData)
        .pipe(first())
        .subscribe(
            data => {
                    console.log("Response" + JSON.stringify(data));
                    //successfully inserted
                    if(data['statusCode'] == 200){                  
                        this.alertService.error('Application data saved successfully');
                        
                        //Add newly created AppID in local storage
                        const appdata:ApplicationMain = { 
                            'appId': data['AppId'],
                            'taxperiod':this.f.taxperiod.value,
                            'xmluploadflag':this.f.xmluploadflag.value, 
                            'appRefno':randomNo, 
                            'applicationStage':1, 
                            'appStatus':'initiated' 
                        };
                        localStorage.setItem("currentUserApp", JSON.stringify(appdata));
                        
                        //this.appservice.currentAppValue(appdata);
                        this.loading = false;
                        this.router.navigate(['taxfilling/basicinfo']);
                    }else if(data['statusCode'] == 301){    //Application already exist for same ass year and userId
                        this.alertService.error('Application already exist for selected Assesment Year');
                        //update fetched AppID in local storage
                        localStorage.removeItem("currentUserApp");
                        const appdata:ApplicationMain = { 
                            'appId': data['AppId'],
                            'taxperiod':this.f.taxperiod.value,
                            'xmluploadflag':this.f.xmluploadflag.value, 
                            'appRefno':randomNo, 
                            'applicationStage':1, 
                            'appStatus':'initiated' 
                        };
                        localStorage.setItem("currentUserApp", JSON.stringify(appdata));
                        //this.appservice.currentAppValue(appdata);
                        this.loading = false;
                        this.router.navigate(['taxfilling/basicinfo']);
                    }
                },
            error => {
                this.alertService.error(error);
                this.loading = false;
            });
        }else{
            this.router.navigate(['taxfilling/basicinfo']);
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
        prevLAYear = (today.getFullYear()-1) + "-" + today.getFullYear() + 1;
    }
    assYearList.push(currentAYear);
    assYearList.push(prevAYear);
    assYearList.push(prevLAYear);
    return assYearList;
}

/*Function to generate random ref number for each newly created application */
generateAppRefNo(userid){
    return  userid + Date.now();
    //console.log("Random no "+randomno);
}



}
