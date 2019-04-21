import { Component, OnInit,AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AlertService, AuthenticationService,ApplicationService } from '@app/_services';
import { handleInsideHeaderBackground,formSticky } from '../../app.helpers';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css']
})
export class PaymentsComponent implements OnInit,AfterViewInit {

  //Global variables to save userdId and ApplictionID
  userId : number;
  ApplicationId : number;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private appService : ApplicationService,
    private alertService : AlertService
  ) 
  {
    //console.log("Current user value "+ JSON.stringify(this.authenticationService.currentUserValue));
    //console.log("Current App value "+ this.appService.currentApplicationValue);
    this.userId         = this.authenticationService.currentUserValue.userid;
    if(this.appService.currentApplicationValue != null){
      this.ApplicationId  = this.appService.currentApplicationValue.appId;
    }
    //console.log("Current App Id "+ this.ApplicationId);
  }

  ngOnInit() {
  }

  ngAfterViewInit(){
    handleInsideHeaderBackground();
    formSticky();
  }

  paynow(){

  }

  FinalSubmission(){
    //console.log("Current App Id "+ this.ApplicationId);
    // start storing application data in database
    this.appService.doFinalSubmission(this.ApplicationId,this.userId)
    .pipe(first())
    .subscribe(
    data => {
            console.log("Response Success" + JSON.stringify(data));
            //successfully inserted
            if(data['statusCode'] == 200){
              //this.alertService.success('Your ITR Application submitted successfully. You can download ITR report from your dashboard');
              alert('Your ITR Application submitted successfully. You can download ITR report from your dashboard');
              this.router.navigate(['/dashboard']);
            }                
        },
    error => {
      console.log("Response Error" + JSON.stringify(error));
      this.alertService.error('Application - Not able to process your request. Please try after sometime or contact admin');
    });
  }

  //Function Called on previous button click
  on_previous_click(){
    this.router.navigate(['taxfilling/review']);
  }

}
