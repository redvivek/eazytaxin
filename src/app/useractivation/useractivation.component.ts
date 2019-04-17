import { Component, OnInit ,AfterViewInit,Input} from '@angular/core';
import { Router} from '@angular/router';
import {AlertService, UserService,AuthenticationService } from '@app/_services';
import { handleInsideHeaderBackground } from '../app.helpers';
import { first } from 'rxjs/operators';

//const URL = `${environment.apiUrl}/users/sendActivationMail`;

@Component({
  selector: 'app-useractivation',
  templateUrl: './useractivation.component.html',
  styleUrls: ['./useractivation.component.css']
})
export class UseractivationComponent implements OnInit,AfterViewInit {
  newUserId : string;
  resendlink : string;

  constructor(
    private router: Router,
      private authenticationService: AuthenticationService,
      private userService: UserService,
      private alertService: AlertService
  ) { 
    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) { 
      this.router.navigate(['/']);
    }

    this.userService.currentMessage.subscribe(message => this.newUserId = message);
    if(this.newUserId == ''){
      this.alertService.error("Invalid Request", true);
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    console.log("New Userid "+this.newUserId);
    /* if(this.newUserId != ''){
      this.resendlink = URL+"?uid="+this.newUserId;
    }else{
      this.resendlink = '';
    }
    console.log("Resend link "+this.resendlink); */
  }

  resendMail() {
    this.userService.sendActivationLink(this.newUserId)
    .pipe(first())
    .subscribe(
        data => {
                console.log("Response" + JSON.stringify(data));
                if(data['Message'] == 'Successful Request'){
                    var msgtemplate = "Activation mail sent successfully. Please check your mail.";
                    this.alertService.success(msgtemplate, true);
                    this.userService.changeMessage(this.newUserId);
                    //this.router.navigate(['/activateuser']); 
                }else{
                  var msgtemplate = "User not registered with us.Request you to do signup first";
                  this.alertService.error(msgtemplate, true);
                }
            },
        error => {
            this.alertService.error(error);
        });
  }

  ngAfterViewInit(){
    handleInsideHeaderBackground();
  }

}
