import { Component, Inject,OnInit,AfterViewInit,NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { WINDOW } from "@app/_services/window.service";
import { DOCUMENT } from '@angular/platform-browser';
import { AlertService, AuthenticationService,ApplicationService } from '@app/_services';
import { handleInsideHeaderBackground,formSticky } from '../../app.helpers';
import { environment } from '@environments/environment';

declare var Razorpay: any;
@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css']
})
export class PaymentsComponent implements OnInit,AfterViewInit {

  //Global variables to save userdId and ApplictionID
  userId : number;
  ApplicationId : number;
  appDetails : any;
  enablePay =true;
  loading = false;
  paymentTranId:string;
  paymentStatus:string;
  rzp1:any;
  options:any;
  transactionFlag = false;

  constructor(
    private ngZone: NgZone,
    private router: Router,
    private authenticationService: AuthenticationService,
    private appService : ApplicationService,
    private alertService : AlertService,
    //private winRef: WindowRef
    @Inject(DOCUMENT) private document: Document,
    @Inject(WINDOW) private winRef
  ) 
  {
    this.userId         = this.authenticationService.currentUserValue.userid;
    if(this.appService.currentApplicationValue != null){
      this.ApplicationId  = this.appService.currentApplicationValue.appId;
    }
    //console.log("Current App Id "+ this.ApplicationId);
  }

  public navigate(commands: any[]): void {
    this.ngZone.run(() => this.router.navigate(commands)).then();
  }

  ngOnInit() {
    this.autoFillAppPaymentInfo(this.ApplicationId,this.userId);
  }

  ngAfterViewInit(){
    handleInsideHeaderBackground();
    formSticky();
  }

  autoFillAppPaymentInfo(appid,userid){
    this.appService.getPaymentInfoByAppidAndUsrid(appid,userid)
    .pipe(first())
    .subscribe(
        data  => {
          //console.log("Response"+JSON.stringify(data));
          if(data['statusCode'] == 200){
              console.log("Result message "+data['Message']);
              if(data['Result'].length > 0){
                this.appDetails =  data['Result'][0];
                this.enablePay = false;
              }

          }
      },
      error => {
          console.log("App details fetch data error"+JSON.stringify(error));
          //return error;
      });
  }

  handlePaymentResponse(response){
    console.log("Success Payment Id "+JSON.stringify(response.razorpay_payment_id));
    if(response.razorpay_payment_id){
      alert('Payment Successful. Press "Click to File Return" to do final submission');
      //this.alertService.success('Payment Successful. Press "Click to File Return" to do final submission');
      this.paymentTranId = response.razorpay_payment_id;
      this.paymentStatus = "Success";
      //this.FinalSubmission(this.paymentTranId);
      var inputJson = {
        'appid' : this.ApplicationId,
        'userid':this.userId,
        'amount':this.appDetails.PlanAmount,
        'transactionId':this.paymentTranId,
        'transStatus' : 'Success',
        'transMsg' : 'Payment Successful'
      }
      this.appService.savePaymentDetails(inputJson)
      .pipe(first())
      .subscribe(
      data => {
              console.log("Response Success" + JSON.stringify(data));
              //successfully inserted
              if(data['statusCode'] == 200){
                this.alertService.success('Your Transaction is Successful.');
                this.navigate(['taxfilling/transaction']);
              }                
          },
      error => {
        console.log("Response Error" + JSON.stringify(error));
        this.alertService.error('Your Transaction Failed. Please contact Admin');
      });
    }else{
      //this.alertService.error('Payment Failed. Please contact Admin or try again after sometime');
      alert("Payment Failed. Please contact Admin or try again after sometime");
      var inputJson = {
        'appid' : this.ApplicationId,
        'userid':this.userId,
        'amount':this.appDetails.PlanAmount,
        'transactionId':'',
        'transStatus' : 'Failed',
        'transMsg' : 'Payment Failed'
      }
      this.appService.savePaymentDetails(inputJson)
      .pipe(first())
      .subscribe(
      data => {
              console.log("Response Success" + JSON.stringify(data));
              //successfully inserted
              if(data['statusCode'] == 200){
                this.alertService.success('Your Transaction is Failed.');
                alert("Your Transaction is Failed.Please contact Admin");
                //this.navigate(['taxfilling/review']);
              }                
          },
      error => {
        console.log("Response Error" + JSON.stringify(error));
        this.alertService.error('Your Transaction Failed. Please contact Admin');
        alert("Your Transaction is Failed.Please contact Admin");
      });
    } 
  }

  handlePaymentDismiss(){
    alert("Payment Cancelled");
    //this.alertService.error('Payment Cancelled');
  }

  public paynow():void{
    //this.loading = true;
     let options = {
      "key": environment.razorAPIKey,
      "name": environment.razorMerchantNm,
      "amount": this.appDetails.PlanAmount+"00", /// The amount is shown in currency subunits. Actual amount is ₹599.
      //"amount": 19900,
      //"order_id": "<YOUR_ORDER_ID>", // Pass the order ID if you are using Razorpay Orders.
      "currency": "INR", // Optional. Same as the Order currency
      "description": "Easytaxin ITR filling payyment",
      //"image": "/your_logo.png",
      "handler" : this.handlePaymentResponse.bind(this),
      "modal": {
        "ondismiss": this.handlePaymentDismiss.bind(this),
      },
      "prefill": {
          "name": this.appDetails.Firstname + this.appDetails.Lastname,
          "email": this.appDetails.EmailId,
          "contact" : this.appDetails.MobileNo,
      },
      /* "notes": {
          "address": "Hello World"
      }, */
      "theme": {
          "color": "#F37254"
      }
    };
    
    this.rzp1 = new this.winRef.Razorpay(options);
    this.rzp1.open();
  }

  //Function Called on previous button click
  on_previous_click(){
    this.router.navigate(['taxfilling/review']);
  }

}
