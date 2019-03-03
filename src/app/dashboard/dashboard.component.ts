import { Component, OnInit,OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { ApplicationMain} from '@app/_models';
import { ScriptService,ApplicationService, AuthenticationService,AlertService } from '@app/_services';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  assesmentYears = [];
  selectedAssYear:any;
  showCurrAssYear:boolean;

  userId : number;
  ApplicationId : number;
  inProgressApps = [];

  constructor(
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
      console.log("Current User Id "+ this.userId);
    }
}

    ngOnInit() {
        this.assesmentYears = this.getCurrentAssesmentYear();
        console.log("Current Assesment Year "+this.assesmentYears);
        this.selectedAssYear = this.assesmentYears[0];
        this.inProgressApps = this.fetchInProgressAppDataByUserID(this.userId);
    }

    onChange(newValue) {
        console.log(newValue);
        this.selectedAssYear = newValue;
        //Fetch and refresh data on change of assesment year
        this.appService.fetchDashboardDataByAssYearUserId(this.selectedAssYear,this.userId)
        .pipe(first())
        .subscribe(
        data => {
                console.log("Response" + JSON.stringify(data));
                //successfully inserted
                if(data['statusCode'] == 200){                  
                    this.alertService.error('Application - Dashboard Info data fetched successfully');
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
            'appRefno':'', 
            'applicationStage':1, 
            'appStatus':'Initiated' 
        };
        localStorage.removeItem("currentUserApp");
        localStorage.setItem("currentUserApp", JSON.stringify(appdata));
        this.router.navigate(['/taxfilling/taxperiod']);
    }

    continueApp(appArray){
        console.log("Selected App details "+ JSON.stringify(appArray));
        this.selectedAssYear = appArray.AssYear;
        //Add newly created AppID in local storage
        const appdata:ApplicationMain = { 
            'appId': appArray.AppId,
            'taxperiod':this.selectedAssYear,
            'xmluploadflag':appArray.xmlFlag, 
            'appRefno':appArray.AppRefno, 
            'applicationStage':appArray.AppStage, 
            'appStatus':'Progress' 
        };
        localStorage.removeItem("currentUserApp");
        localStorage.setItem("currentUserApp", JSON.stringify(appdata));
        var currStage  = this.appService.currentApplicationValue.applicationStage;
        if(currStage == "")
            this.router.navigate(['/taxfilling/taxperiod']);
        else if(currStage == 1)
           this.router.navigate(['/taxfilling/basicinfo']);
        else if(currStage >= 2 && currStage < 7)
            this.router.navigate(['/taxfilling/personalinfo']);
        else if(currStage >= 7 && currStage < 12)
            this.router.navigate(['/taxfilling/earnings']);
        else if(currStage >= 13 && currStage < 16)
            this.router.navigate(['/taxfilling/deductions']);
        else if(currStage == 17)
            this.router.navigate(['/taxfilling/taxpaid']);
        else if(currStage >= 18)
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
            prevLAYear = (today.getFullYear()-1) + "-" + today.getFullYear() + 1;
        }
        assYearList.push(currentAYear);
        assYearList.push(prevAYear);
        assYearList.push(prevLAYear);
        return assYearList;
    }

    fetchInProgressAppDataByUserID(userid){
        var resultArray = [];
        // start storing application data in database
        this.appService.fetchInProgAppDataByUserid(userid)
        .pipe(first())
        .subscribe(
            data => {
                    //console.log("Response" + JSON.stringify(data));
                    if(data['statusCode'] == 200){                  
                        if(data['ResultData'].length > 0){
                            for(var i=0;i<data['ResultData'].length;i++){
                                if(data['ResultData'][i].AssesmentYear == this.assesmentYears[0]){
                                    this.showCurrAssYear = false;
                                }else{
                                    this.showCurrAssYear = true;
                                }
                                
                                resultArray.push(
                                    {
                                        "AppId":data['ResultData'][i].ApplicationId,
                                        "AppRefno":data['ResultData'][i].AppRefNo,
                                        "AssYear":data['ResultData'][i].AssesmentYear,
                                        "AppStage":data['ResultData'][i].ApplicationStage,
                                        "xmlFlag":data['ResultData'][i].XmlUploadFlag
                                    }
                                )
                            }
                        }else{
                            this.showCurrAssYear = true;
                        }
                    }
                },
            error => {
                console.log("Error "+error);
            });
        return resultArray;
    }
}
