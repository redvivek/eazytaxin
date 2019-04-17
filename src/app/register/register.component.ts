import { Component, OnInit,AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup,FormControl, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import {AlertService, UserService, AuthenticationService } from '@app/_services';
import * as Waves from 'node-waves';
import { handleInsideHeaderBackground,handleFloatingLabels } from '../app.helpers';

@Component({templateUrl: 'register.component.html'})
export class RegisterComponent implements OnInit,AfterViewInit {
    registerForm: FormGroup;
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
        //console.log("^([a-zA-Z0-9_.-]+)@([a-zA-Z0-9_.-]+)\\.([a-zA-Z]{2,5})$");
        //console.log("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}");
        this.registerForm = this.formBuilder.group({
            //panNumber: ['', Validators.required],
            emailId: ['', [
                Validators.required,
                Validators.pattern("^([a-zA-Z0-9_.-]+)@([a-zA-Z0-9_.-]+)\\.([a-zA-Z]{2,5})$")
            ],
            //this.existingEmailIdValidator.bind(this), //check existing email id in database
            ],
            nPassword: ['', [
                Validators.required,
                //Validators.minLength(8), 
                Validators.pattern("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}")
            ]],
            cPassword: ['', Validators.required],
            terms: ['', Validators.required],
            
        },{validator: this.checkIfMatchingPasswords('nPassword','cPassword')}
        );
    }

    ngAfterViewInit(){
        handleInsideHeaderBackground();
        handleFloatingLabels(Waves);
    }

    //Validation to check if email already exisits or not
    private existingEmailIdValidator(control: FormControl) {
        const q = new Promise((resolve, reject) => {
            setTimeout(() => {
                this.userService.checkUserByEmailId(control.value).subscribe(() => {
                resolve(null);
                }, () => { resolve({ 'isEmailUnique': true }); });
            }, 1000);
        });
        return q;
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
    get f() { return this.registerForm.controls; }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.registerForm.invalid) {
            return;
        }

        this.loading = true;
        console.log('Input Values :-)\n\n' + JSON.stringify(this.registerForm.value))
        this.userService.register(this.registerForm.value)
        .pipe(first())
        .subscribe(
            data => {
                    console.log("Response" + JSON.stringify(data));
                    if(data['Message'] == 'Invalid Username'){
                        this.alertService.error('Username/Email is already registered');
                        this.loading = false;
                    }else if(data['Message'] == 'Successful Request'){
                        var msgtemplate = "Registration successfully completed.";
                        this.alertService.success(msgtemplate, true);
                        this.userService.changeMessage(data['userid']);
                        //this.newUserId = data['userid'];
                        this.router.navigate(['/activateuser']); 
                    }
                },
            error => {
                this.alertService.error(error);
                this.loading = false;
            });
    }
}
