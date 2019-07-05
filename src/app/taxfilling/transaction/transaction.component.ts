import { Component, Inject,OnInit,AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AlertService, AuthenticationService,ApplicationService } from '@app/_services';
import { handleInsideHeaderBackground,formSticky } from '../../app.helpers';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit,AfterViewInit {

  //Global variables to save userdId and ApplictionID
  userId : number;
  ApplicationId : number;
  appDetails;
  transactionFlag = false;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private appService : ApplicationService,
    private alertService : AlertService
  ) { 
    this.userId         = this.authenticationService.currentUserValue.userid;
    if(this.appService.currentApplicationValue != null){
      this.ApplicationId  = this.appService.currentApplicationValue.appId;
    }
    //console.log("Current App Id "+ this.ApplicationId);
  }

  ngOnInit() {
    this.autoFillAppTransInfo(this.ApplicationId,this.userId);
  }

  ngAfterViewInit(){
    handleInsideHeaderBackground();
    formSticky();
  }

  autoFillAppTransInfo(appid,userid){
    this.appService.getTransInfoByAppidAndUsrid(appid,userid)
    .pipe(first())
    .subscribe(
        data  => {
          //console.log("Response"+JSON.stringify(data));
          if(data['statusCode'] == 200){
              console.log("Result message "+data['Message']);
              if(data['Result'].length > 0){
                this.appDetails =  data['Result'][0];
                this.transactionFlag = true;
              }
          }
      },
      error => {
          console.log("App details fetch data error"+JSON.stringify(error));
          //return error;
      });
  }

  FinalSubmission(){
    //console.log("Current Payment Id "+ paymentid);
    // start storing application data in database
    this.appService.doFinalSubmission(this.ApplicationId,this.userId)
    .pipe(first())
    .subscribe(
    data => {
            //console.log("Response Success" + JSON.stringify(data));
            //successfully inserted
            if(data['statusCode'] == 200){
              //this.alertService.success('Your ITR Application submitted successfully. You can download ITR report from your dashboard');
              alert('Your ITR Application submitted successfully. You can download ITR report from your dashboard');
              //localStorage.removeItem('currentUserApp');
              this.appService.setCurrApplicationValue(null);
              this.router.navigate(['/dashboard']);
            }              
        },
    error => {
      console.log("Response Error" + JSON.stringify(error));
      this.alertService.error('Application - Not able to process your request. Please try after sometime or contact admin');
    });
  }

}
