import { Component, OnInit,AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup,FormControl, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import {AlertService, UserService ,AuthenticationService} from '@app/_services';
import * as Waves from 'node-waves';
import { handleInsideHeaderBackground,handleFloatingLabels } from '../app.helpers';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.css']
})
export class ForgotpasswordComponent implements OnInit,AfterViewInit {

  forgotPwdForm: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private alertService: AlertService
  ) { 
    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) { 
        this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.forgotPwdForm = this.formBuilder.group({
        //panNumber: ['', Validators.required],
        emailId: ['', [
            Validators.required,
            Validators.pattern("^([a-zA-Z0-9_.-]+)@([a-zA-Z0-9_.-]+)\\.([a-zA-Z]{2,5})$")
        ],
        ],
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.forgotPwdForm.controls; }

  ngAfterViewInit(){
    handleInsideHeaderBackground();
      handleFloatingLabels(Waves);
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.forgotPwdForm.invalid) {
        return;
    }

    this.loading = true;
    console.log('Input Values :-)\n\n' + JSON.stringify(this.forgotPwdForm.value))
    this.userService.forgetPassword(this.f.emailId.value)
    .pipe(first())
    .subscribe(
    data => {
      console.log("Response"+JSON.stringify(data));
      if(data['Message'] == 'Valid User'){
          this.alertService.success('Password reset mail sent successfully to your mailid', true);
          this.loading = false;
      }else if(data['Message'] == 'Inactive User'){
          this.userService.changeMessage(data['userid']);
          this.router.navigate(['/activateuser']);
          this.loading = false;
      }else{
          this.alertService.error('Not a valid emailId. Please signup!!');
          this.loading = false;
      }    
  },
  error => {
      console.log("Login error"+JSON.stringify(error));
      this.alertService.error('Not a valid emailId. Please signup!!');
      this.loading = false;
  });
}

}
