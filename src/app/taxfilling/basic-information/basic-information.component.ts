import { Component, OnInit,AfterViewInit} from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import {Basicinfo} from '@app/_models';
import { ScriptService,AuthenticationService,ApplicationService, AlertService } from '@app/_services';
import { handleInsideHeaderBackground,handleFloatingLabels } from '../../app.helpers';
import * as Waves from 'node-waves';

@Component({
  selector: 'app-basic-information',
  templateUrl: './basic-information.component.html',
  styleUrls: ['./basic-information.component.css']
})
export class BasicInformationComponent implements OnInit,AfterViewInit {
  basicInfoForm: FormGroup;
  disable = true;
  loading = false;
  submitted = false;
  userId: number;
  ApplicationId : number;
  //AppMainDetails : Basicinfo;
  checked :boolean;
  checked1 :boolean;
  checked2 :boolean;
  checked3 :boolean;
  checked4 :boolean;
  checked5 :boolean;
  checked6 :boolean;
  checked7 :boolean;
  checked8 :boolean;
  checked9 :boolean;

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
            console.log("Current App value "+ this.appService.currentApplicationValue);
            this.userId         = this.authenticationService.currentUserValue.userid;
            if(this.appService.currentApplicationValue.appId != ""){
                this.ApplicationId  = this.appService.currentApplicationValue.appId;
                this.disable = false;
            }else{
                this.ApplicationId = null;
            }
            console.log("Current App Id "+ this.ApplicationId);
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

        if(this.ApplicationId != null){
            this.fetchAppMaindata(this.ApplicationId);
        }
    }

    ngAfterViewInit(){
        handleInsideHeaderBackground();
        handleFloatingLabels(Waves);
    }

  // convenience getter for easy access to form fields
  get f() { return this.basicInfoForm.controls; }

  fetchAppMaindata(appid : number){
    //fetch Basic info data by AppId
    this.appService.getByAppId(appid)
    .pipe(first())
    .subscribe(
        data  => {
            //console.log("Response"+JSON.stringify(data));
            if(data){
                //this.AppMainDetails =  data;
                //console.log("Value "+ JSON.stringify(data));
                //Preload form with existing or default values
                if(data.IncomeSalaryFlag == 1){
                    this.checked = true;
                    this.basicInfoForm.get('incomeFromSalary').setValue('1');
                }else{
                    this.checked = false;
                    this.basicInfoForm.get('incomeFromSalary').setValue('0');
                }
                if(data.IncomeOthersFlag == 1){
                    this.checked1 = true;
                    this.basicInfoForm.get('incomeFromOtherSources').setValue('1');
                }else{
                    this.checked1 = false;
                    this.basicInfoForm.get('incomeFromOtherSources').setValue('0');
                }
                if(data.IncomeHouseFlag == 1){
                    this.checked2 = true;
                    this.basicInfoForm.get('selfOccupiedProp').setValue('1');
                }else{
                    this.checked2 = false;
                    this.basicInfoForm.get('selfOccupiedProp').setValue('0');
                }
                if(data.IncomeRentalFlag == 1){
                    this.checked3 = true;
                    this.basicInfoForm.get('rentalProperty').setValue('1');
                }else{
                    this.checked3= false;
                    this.basicInfoForm.get('rentalProperty').setValue('0');
                }
                if(data.IncomeCapitalGainsFlag == 1){
                    this.checked4 = true;
                    this.basicInfoForm.get('incomeFromCapitals').setValue('1');
                }else{
                    this.checked4 = false;
                    this.basicInfoForm.get('incomeFromCapitals').setValue('0');
                }
                if(data.DeductionsFlag == 1){
                    this.checked5 = true;
                    this.basicInfoForm.get('deductionsFlag').setValue('1');
                }else{
                    this.checked5 = false;
                    this.basicInfoForm.get('deductionsFlag').setValue('0');
                }
                if(data.ResidentIndianFlag == 1){
                    this.checked6 = true;
                    this.basicInfoForm.get('residentIndianFlag').setValue('1');
                }else{
                    this.checked6 = false;
                    this.basicInfoForm.get('residentIndianFlag').setValue('0');
                }
                if(data.NonResidentIndianFlag == 1){
                    this.checked7 = true;
                    this.basicInfoForm.get('nonResidentIndianFlag').setValue('1');
                }else{
                    this.checked7 = false;
                    this.basicInfoForm.get('nonResidentIndianFlag').setValue('0');
                }
                if(data.OciResidentIndianFlag == 1){
                    this.checked8 = true;
                    this.basicInfoForm.get('ociResidentIndianFlag').setValue('1');
                }else{
                    this.checked8 = false;
                    this.basicInfoForm.get('ociResidentIndianFlag').setValue('0');
                }
                if(data.PresentIndiaFlag == 1){
                    this.checked9 = true;
                    this.basicInfoForm.get('presentIndiaFlag').setValue('1');
                }else{
                    this.checked9 = false;
                    this.basicInfoForm.get('presentIndiaFlag').setValue('0');
                }
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
                        this.localStoreg['applicationStage'] = 2;
                        this.localStoreg['appStatus'] = 'progress';
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

    on_previous_click(){
        this.router.navigate(['taxfilling/taxperiod']);
    }

    clearForm(){
        this.basicInfoForm.reset();
    }

}
