import { Component, OnInit,OnDestroy,AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { ApplicationMain} from '@app/_models';
import { ApplicationService, AuthenticationService,AlertService } from '@app/_services';
import { handleInsideHeaderBackground } from '../app.helpers';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit,AfterViewInit {
  assesmentYears = [];
  selectedAssYear:any;
  showCurrAssYear:boolean;
  showComplete:boolean;

  userId : number;
  ApplicationId : number;
  inProgressApps = [];
  dashboardInfo = {
      'Firstname':'NA',
      'Lastname':'NA',
      'PanNumber':'NA',
      'DateOfBirth':'NA',
      'Type':'NA',
      'PlanName':'NA',
      'MobileNo':'NA'
  };

  constructor(
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
        //console.log("Current User Id "+ this.userId);
        }
}

    ngOnInit() {
        this.assesmentYears = this.getCurrentAssesmentYear();
        //console.log("Current Assesment Year "+this.assesmentYears);
        var today = new Date();
        if (today.getMonth() > 7) {
            this.selectedAssYear = this.assesmentYears[0];
        }else{
            this.selectedAssYear = this.assesmentYears[1];
        }
        this.fetchDashboardInfoByAssYrAndUser(this.selectedAssYear,this.userId);
        //this.inProgressApps = this.fetchInProgressAppDataByUserID(this.selectedAssYear,this.userId);
    }

    ngAfterViewInit(){
		handleInsideHeaderBackground();
	}

    onChange(newValue) {
        console.log(newValue);
        this.selectedAssYear = newValue;
        this.fetchDashboardInfoByAssYrAndUser(this.selectedAssYear,this.userId);
    }

    fetchDashboardInfoByAssYrAndUser(assyear:string,uid:number){
        //Fetch and refresh data on change of assesment year
        this.appService.fetchDashboardDataByAssYearUserId(assyear,uid)
        .pipe(first())
        .subscribe(
        data => {
                //console.log("Response" + JSON.stringify(data));
                //successfully inserted
                if(data['statusCode'] == 200 && data['Result'].length > 0 ){
                    this.showCurrAssYear = false;                  
                    this.alertService.success('Application - Dashboard Info data fetched successfully');
                    var res = data['Result'][0];
                    this.fetchAppDetailsAppDataByUserID(res['ApplicationId'],res['UserId']);
                    this.inProgressApps = this.fetchInProgressAppDataByUserID(res['AssesmentYear'],res['UserId']);

                    if(res['ApplicationStatus'] == 'Complete')
                        this.showComplete = true;
                    else
                        this.showComplete = false;
                    
                }else{
                    this.showCurrAssYear = true;
                }
            },
        error => {
            this.alertService.error('Application - Dashboard Info data fetch failed');
        });
    }

    startFilling(selAssYear){
        console.log(selAssYear);
        this.selectedAssYear = selAssYear;
        //Add newly created AppID in local storage
        const appdata:ApplicationMain = { 
            'appId': "",
            'taxperiod':this.selectedAssYear,
            'xmluploadflag':'', 
            'applicationStage':1, 
            'appStatus':'Progress' 
        };
        localStorage.removeItem("currentUserApp");
        localStorage.setItem("currentUserApp", JSON.stringify(appdata));
        this.appService.setCurrApplicationValue(appdata);
        this.router.navigate(['/taxfilling/taxperiod']);
    }

    continueApp(appArray){
        this.selectedAssYear = appArray.AssYear;
        if(appArray.AppStage == "" || appArray.AppStage == 0)
            this.router.navigate(['/taxfilling/taxperiod']);
        else if(appArray.AppStage == 1)
           this.router.navigate(['/taxfilling/basicinfo']);
        else if(appArray.AppStage >= 2 && appArray.AppStage < 8)
            this.router.navigate(['/taxfilling/personalinfo']);
        else if(appArray.AppStage >= 7 && appArray.AppStage < 13)
            this.router.navigate(['/taxfilling/earnings']);
        else if(appArray.AppStage >= 13 && appArray.AppStage < 17)
            this.router.navigate(['/taxfilling/deductions']);
        else if(appArray.AppStage >= 17 && appArray.AppStage < 18)
            this.router.navigate(['/taxfilling/taxpaid']);
        else if(appArray.AppStage >= 18)
            this.router.navigate(['/taxfilling/review']);
        else
            this.router.navigate(['/taxfilling/review']);
    }

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

    fetchAppDetailsAppDataByUserID(appid:number,userid:number){
        var resultObj = [];
        this.appService.fetchAppDetailsByAppidAndUserId(appid,userid)
        .pipe(first())
        .subscribe(
        data => {
            //console.log("Response" + JSON.stringify(data));
            //successfully inserted
            if(data['statusCode'] == 200 && data['Result'].length > 0 ){
                resultObj = data['Result'];
                this.dashboardInfo = data['Result'][0];
            }else{
                this.dashboardInfo = {
                    'Firstname':'NA',
                    'Lastname':'NA',
                    'PanNumber':'NA',
                    'DateOfBirth':'NA',
                    'Type':'NA',
                    'PlanName':'NA',
                    'MobileNo':'NA'
                };
            }
        },
        error => {
            this.alertService.error('Application - Dashboard Info data fetch failed');
            //return resultObj;
        });
        
    }

    fetchInProgressAppDataByUserID(selYear:string,userid:number){
        //console.log("Input Values "+selYear+userid);
        var resultArray = [];
        // start storing application data in database
        this.appService.fetchInProgAppDataByUserid(userid,selYear)
        .pipe(first())
        .subscribe(
            data => {
                    //console.log("Response" + JSON.stringify(data));
                    if(data['statusCode'] == 200){                  
                        if(data['ResultData'].length > 0){
                            for(var i=0;i<data['ResultData'].length;i++){
                                if(data['ResultData'][i].AssesmentYear == this.selectedAssYear){
                                    this.showCurrAssYear = false;
                                }
                                
                                resultArray.push(
                                {
                                    "AppId":data['ResultData'][i].ApplicationId,
                                    "AssYear":data['ResultData'][i].AssesmentYear,
                                    "AppStage":data['ResultData'][i].ApplicationStage,
                                    "xmlFlag":data['ResultData'][i].XmlUploadFlag
                                }
                                )
                            }
                        }
                    }
                },
            error => {
                console.log("Error "+error);
            });
        return resultArray;
    }
}
