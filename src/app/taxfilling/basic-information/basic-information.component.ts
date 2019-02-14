import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import {Basicinfo} from '@app/_models';
import { ScriptService,AuthenticationService,ApplicationService, AlertService } from '@app/_services';

@Component({
  selector: 'app-basic-information',
  templateUrl: './basic-information.component.html',
  styleUrls: ['./basic-information.component.css']
})
export class BasicInformationComponent implements OnInit {
  basicInfoForm: FormGroup;
  loading = false;
  submitted = false;
  userId: number;
  ApplicationId : number;
  AppMainDetails : Basicinfo;
  localStoreg = JSON.parse(localStorage.getItem("currentUserApp"));

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private appService : ApplicationService,
    private alertService : AlertService,
    private scriptservice : ScriptService
  ) { 
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

            this.fetchAppMaindata(this.ApplicationId);
        }
    }

  ngOnInit() {

    this.basicInfoForm = this.formBuilder.group({
      incomeFromSalary: ['', Validators.required],
      incomeFromOtherSources : ['',Validators.required],
      selfOccupiedProp : ['',Validators.required],
      rentalProperty : ['',Validators.required],
      incomeFromCapitals: ['',Validators.required],
      deductionsFlag: ['',Validators.required],
      residentIndianFlag: ['',Validators.required],
      nonResidentIndianFlag: ['',Validators.required],
      ociResidentIndianFlag: ['',Validators.required],
      presentIndiaFlag: ['',Validators.required],
    });

    //Preload form with existing or default values
    //this.basicInfoForm.get('incomeFromSalary').setValue(this.AppMainDetails.incomeFromSalary);
    //this.basicInfoForm.get('incomeFromOtherSources').setValue(this.AppMainDetails.incomeFromOtherSources);
    /*this.basicInfoForm.get('selfOccupiedProp').setValue(this.AppMainDetails.selfOccupiedProp);
    this.basicInfoForm.get('rentalProperty').setValue(this.AppMainDetails.rentalProperty);
    this.basicInfoForm.get('incomeFromCapitals').setValue(this.AppMainDetails.incomeFromCapitals);
    this.basicInfoForm.get('deductionsFlag').setValue(this.AppMainDetails.deductionsFlag);
    this.basicInfoForm.get('residentIndianFlag').setValue('1');
    this.basicInfoForm.get('nonResidentIndianFlag').setValue('1');
    this.basicInfoForm.get('ociResidentIndianFlag').setValue('1');
    this.basicInfoForm.get('presentIndiaFlag').setValue('1');*/
  }

  // convenience getter for easy access to form fields
  get f() { return this.basicInfoForm.controls; }

  fetchAppMaindata(appid : number){
      //fetch Basic info data by AppId
    this.appService.getByAppId(appid)
    .pipe(first())
    .subscribe(
        data  => {
            console.log("Response"+JSON.stringify(data));
            if(data){
              this.AppMainDetails =  data;
              console.log("Value "+ this.AppMainDetails.incomeFromSalary);
            }
        },
        error => {
            console.log("AppMain fetch data error"+JSON.stringify(error));
            //this.loading = false;
            return error;
        });
  }

  onSubmit() {
    this.submitted = true;
    this.loading = true;
    // stop here if form is invalid
    if (this.basicInfoForm.invalid) {
        return;
    }
      
    console.log('Input Values :-)\n\n' + JSON.stringify(this.basicInfoForm.value));
    //create the input params for post request
    const basicInfoData = {
        'appId':this.ApplicationId,
        'userId':this.userId,
        'incomeFromSalary' : this.f.incomeFromSalary.value,
        'incomeFromOtherSources':this.f.incomeFromOtherSources.value,
        'selfOccupiedProp':this.f.selfOccupiedProp.value,
        'rentalProperty':this.f.rentalProperty.value,
        'incomeFromCapitals':this.f.incomeFromCapitals.value,
        'deductionsFlag':this.f.deductionsFlag.value,
        'residentIndianFlag':this.f.residentIndianFlag.value,
        'nonResidentIndianFlag':this.f.nonResidentIndianFlag.value,
        'ociResidentIndianFlag':this.f.ociResidentIndianFlag.value,
        'presentIndiaFlag':this.f.presentIndiaFlag.value,
    };
    // start storing application data in database
    this.appService.updateApplicationMain(basicInfoData)
    .pipe(first())
    .subscribe(
        data => {
                console.log("Response" + JSON.stringify(data));
                //successfully inserted
                if(data['statusCode'] == 200){                  
                    this.alertService.error('Application - BasicInfo data saved successfully');
                    this.loading = false;
                    this.localStoreg['applicationStage'] = 4;
                    localStorage.removeItem("currentUserApp");
                    localStorage.setItem("currentUserApp", JSON.stringify(this.localStoreg));
                    this.router.navigate(['taxfilling/personalinfo']);
                }
            },
        error => {
            this.alertService.error(error);
            this.loading = false;
        });
  }

}
