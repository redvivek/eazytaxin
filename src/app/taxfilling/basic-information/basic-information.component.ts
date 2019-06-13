import { Component, OnInit,AfterViewInit} from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthenticationService,ApplicationService, AlertService } from '@app/_services';
import { handleInsideHeaderBackground,handleFloatingLabels,formSticky } from '../../app.helpers';
import * as Waves from 'node-waves';

@Component({
  selector: 'app-basic-information',
  templateUrl: './basic-information.component.html',
  styleUrls: ['./basic-information.component.css']
})
export class BasicInformationComponent implements OnInit,AfterViewInit {
    basicInfoForm: FormGroup;
    nextButtonDisable = false;
    previousButtonDisable = false;
    loading = false;
    submitted = false;
    userId: number;
    ApplicationId : number;
    showSubRORQuesOne = false;
    showSubRORQuesTwo = false;
    showMainNRQues = false;
    showSubNRQues = false;
    //showLongPresentResidentQues = false;

    checked6 :boolean;
    checked7 :boolean;
    checked8 :boolean;
    checked9 :boolean;
    checked10 :boolean;

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
            console.log("Current App Id "+ this.ApplicationId);
        }
    }

    ngOnInit() {

        this.basicInfoForm = this.formBuilder.group({
            mainRORQuestionFlag: ['',Validators.required],
            firstSubRORFlag: [''],
            secondSubRORFlag: [''],
            mainNROuestionFlag: [''],
            subNROuestionFlag: ['']
        });

        //call this to enable/disable & validate file upload form field on Radio change event
        this.formControlValueChanged();

        if(this.ApplicationId != null){
            this.fetchAppMaindata(this.ApplicationId);
        }
    }

    ngAfterViewInit(){
        handleInsideHeaderBackground();
        handleFloatingLabels(Waves);
        formSticky();
    }

    // convenience getter for easy access to form fields
    get f() { return this.basicInfoForm.controls; }

    /* Function to enable/disable & validate file upload form field on Radio change event */
    formControlValueChanged() {
        this.basicInfoForm.get('mainRORQuestionFlag').valueChanges.subscribe(
        (mode: boolean) => {
            //console.log(mode);
            if (mode == true) {
                this.showSubRORQuesOne = true;
                this.showSubRORQuesTwo = false;
                this.showMainNRQues = false;
                this.showSubNRQues = false;
            }
            else {
                this.showSubRORQuesOne = false;
                this.showSubRORQuesTwo = false;
                this.showMainNRQues = true;
                this.showSubNRQues = false;
            }
            
        });

        this.basicInfoForm.get('firstSubRORFlag').valueChanges.subscribe(
        (mode: boolean) => {
            //console.log(mode);
            if (mode == true) {
                this.showSubRORQuesOne = true;
                this.showSubRORQuesTwo = true;
                this.showMainNRQues = false;
                this.showSubNRQues = false;
            }
            else {
                this.showSubRORQuesOne = true;
                this.showSubRORQuesTwo = false;
                this.showMainNRQues = false;
                this.showSubNRQues = false;
            }
        });

        this.basicInfoForm.get('mainNROuestionFlag').valueChanges.subscribe(
        (mode: boolean) => {
            //console.log(mode);
            if (mode == true) {
                this.showSubRORQuesOne = false;
                this.showSubRORQuesTwo = false;
                this.showMainNRQues = true;
                this.showSubNRQues = true;
            }
            else {
                this.showSubRORQuesOne = false;
                this.showSubRORQuesTwo = false;
                this.showMainNRQues = true;
                this.showSubNRQues = false;
            }
        });
    }

    fetchAppMaindata(appid : number){
        //fetch Basic info data by AppId
        this.appService.getByAppId(appid)
        .pipe(first())
        .subscribe(
            data  => {
                //console.log("Response"+JSON.stringify(data));
                if(data){
                    //Preload form with existing or default values
                    if(data.ResidentIndianFlag == 1){
                        this.checked6 = true;
                        this.basicInfoForm.get('mainRORQuestionFlag').setValue('1');
                    }else if(data.ResidentIndianFlag == 0){
                        this.checked6 = false;
                        this.basicInfoForm.get('mainRORQuestionFlag').setValue('0');
                    }

                    if(data.NonResidentIndianFlag == 1){
                        this.checked7 = true;
                        this.basicInfoForm.get('mainNROuestionFlag').setValue('1');
                    }else if(data.NonResidentIndianFlag == 0){
                        this.checked7 = false;
                        this.basicInfoForm.get('mainNROuestionFlag').setValue('0');
                    }
                    
                    if(data.OciResidentIndianFlag == 1){
                        this.checked8 = true;
                        this.basicInfoForm.get('subNROuestionFlag').setValue('1');
                    }else if(data.OciResidentIndianFlag == 0){
                        this.checked8 = false;
                        this.basicInfoForm.get('subNROuestionFlag').setValue('0');
                    }
                    
                    if(data.ShrtPresentIndiaFlag == 1){
                        this.checked9 = true;
                        this.basicInfoForm.get('firstSubRORFlag').setValue('1');
                    }else if(data.ShrtPresentIndiaFlag == 1){
                        this.checked9 = false;
                        this.basicInfoForm.get('firstSubRORFlag').setValue('0');
                    }
                    
                    if(data.LngPresentIndiaFlag == 1){
                        this.checked10 = true;
                        this.basicInfoForm.get('secondSubRORFlag').setValue('1');
                    }else if(data.LngPresentIndiaFlag == 0){
                        this.checked10 = false;
                        this.basicInfoForm.get('secondSubRORFlag').setValue('0');
                    }
                }
            },
            error => {
                console.log("AppMain fetch data error"+JSON.stringify(error));
                this.loading = false;
                return error;
            });
    }

    onSubmit() {
        this.submitted = true;
        this.loading = true;
        var residenttype;
        // stop here if form is invalid
        if (this.basicInfoForm.invalid) {
            this.loading = false;
            return;
        }
      
        console.log('Input Values :-)\n\n' + JSON.stringify(this.basicInfoForm.value));

        //create the input params for post request
        const basicInfoData = {
            'appId':this.ApplicationId,
            'userId':this.userId,
            'residentIndianFlag':this.f.mainRORQuestionFlag.value,
            'srtPresentIndiaFlag':this.showSubRORQuesOne ? this.f.firstSubRORFlag.value:"",
            'lngPresentIndiaFlag':this.showSubRORQuesTwo ? this.f.secondSubRORFlag.value:"",
            'nonResidentIndianFlag':this.showMainNRQues ? this.f.mainNROuestionFlag.value : "",
            'ociResidentIndianFlag':this.showSubNRQues ? this.f.subNROuestionFlag.value :""
        };
        

        // start storing application data in database
        this.appService.updateApplicationMain(basicInfoData)
        .pipe(first())
        .subscribe(
            data => {
                    //console.log("Response" + JSON.stringify(data));
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
        this.showSubRORQuesOne = false;
        this.showSubRORQuesTwo = false;
        this.showMainNRQues = false;
        this.showSubNRQues = false;
    }

}
