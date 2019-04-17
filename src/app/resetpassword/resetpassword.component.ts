import { Component, OnInit,AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import {AlertService, UserService,AuthenticationService } from '@app/_services';
import * as Waves from 'node-waves';
import { handleInsideHeaderBackground,handleFloatingLabels } from '../app.helpers';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.css']
})
export class ResetpasswordComponent implements OnInit,AfterViewInit {

  resetPasswordForm: FormGroup;
  loading = false;
  submitted = false;
  resetCode :string;
  userid:string;
  invalidRequest = false;
  invalidMessage : string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private alertService: AlertService
  ) { 
    // redirect to dashboard if already logged in
    if (this.authenticationService.currentUserValue) { 
        this.router.navigate(['/dashboard']);
    }
    // get id from route parameters
    this.resetCode = this.route.snapshot.queryParams['id'];
    // get uid from route parameters
    this.userid = this.route.snapshot.queryParams['uid'];
    console.log("Req params"+this.resetCode,this.userid );
    if(this.resetCode != '' && this.userid != ''){
      this.verifyResetCode(this.resetCode,this.userid);
    }else{
      this.invalidRequest = true;
      this.invalidMessage = "Bad request or link is expired!!";
    }
  }

  ngOnInit() {
    this.resetPasswordForm = this.formBuilder.group({
        nPassword: ['', [
            Validators.required,
            Validators.pattern("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}")
        ]],
        cPassword: ['', Validators.required],
        
    },{validator: this.checkIfMatchingPasswords('nPassword','cPassword')}
    );
  }

  verifyResetCode(resetcode,userid){
    this.userService.verifyCode(resetcode,userid)
    .pipe(first())
    .subscribe(
    data => {
            console.log("Response" + JSON.stringify(data));
            if(data['Message'] == 'Invalid Link'){
                this.invalidRequest = true;
                this.invalidMessage = "Bad request or link is expired!!";
                this.loading = false;
            }else if(data['Message'] == 'Valid User'){
                this.invalidRequest = false;
                var msgtemplate = "User Verfied successfully. Please set your new password";
                this.alertService.success(msgtemplate, true);
                this.loading = false;
            }else{
              this.invalidRequest = true;
              this.invalidMessage = "Bad request or link is expired!!";
              this.loading = false;
            }
        },
    error => {
        this.alertService.error(error);
        this.loading = false;
    });
  }

  ngAfterViewInit(){
      handleInsideHeaderBackground();
      handleFloatingLabels(Waves);
  }

  //validation to check passwords match or not
  private checkIfMatchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
      return (group: FormGroup) => {
          const passwordInput = group.controls[passwordKey];
          const passwordConfirmationInput = group.controls[passwordConfirmationKey];
          
          if (passwordConfirmationInput.errors && !passwordConfirmationInput.errors.notEquivalent) {
              // return if another validator has already found an error on the matchingControl
              return;
          }
          
        if (passwordInput.value !== passwordConfirmationInput.value) {
          return passwordConfirmationInput.setErrors({notEquivalent: true});
        } else {
          return passwordConfirmationInput.setErrors(null);
        }
      };
  }

  // convenience getter for easy access to form fields
  get f() { return this.resetPasswordForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.resetPasswordForm.invalid) {
        return;
    }
    this.loading = true;
    this.userService.resetPassword(this.userid, this.f.nPassword.value)
    .pipe(first())
    .subscribe(
        data => {
            console.log("Response"+JSON.stringify(data));
            if(data['Message'] == 'Successful Request'){
                this.alertService.success('Password reset successful', true);
                this.router.navigate(['/login']);
                this.loading = false;
            }   
        },
        error => {
            console.log("Reset pwd error"+JSON.stringify(error));
            this.alertService.error('Password reset failed');
            this.loading = false;
        });
}

}
