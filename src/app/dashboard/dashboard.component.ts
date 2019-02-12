import { Component, OnInit,OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { ApplicationMain} from '@app/_models';
import { ApplicationService, AuthenticationService,AlertService } from '@app/_services';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  assesmentYears = [];
  selectedAssYear:any;

  userId : number;
  ApplicationId : number;

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
      console.log("Current User Id "+ this.userId);
    }
}

    ngOnInit() {
        this.assesmentYears = this.getCurrentAssesmentYear();
        console.log("Current Assesment Year "+this.assesmentYears);
        this.selectedAssYear = this.assesmentYears[0];
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
                //if(data['statusCode'] == 200){                  
                    //this.alertService.error('Application - Personal Info data saved successfully');
               // }
            },
        error => {
            //this.alertService.error(error);
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
            'appStatus':'initiated' 
        };
        localStorage.removeItem("currentUserApp");
        localStorage.setItem("currentUserApp", JSON.stringify(appdata));
        this.router.navigate(['/taxfilling/taxperiod']);
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
}
