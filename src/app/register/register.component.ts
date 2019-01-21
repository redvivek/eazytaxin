import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AlertService, UserService, AuthenticationService } from '@app/_services';


@Component({templateUrl: 'register.component.html'})
export class RegisterComponent implements OnInit {
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
        this.registerForm = this.formBuilder.group({
            //panNumber: ['', Validators.required],
            emailId: ['', [
                Validators.required,
                Validators.pattern('^[a-zA-Z0–9_.+-]+@[a-zA-Z0–9-]+.[a-zA-Z0–9-.]+$')
            ]],
            nPassword: ['', [
                Validators.required,
                //Validators.minLength(8), 
                Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')
            ]],
            cPassword: ['', Validators.required],
            terms: ['', Validators.required],
            
        },{validator: this.checkIfMatchingPasswords('nPassword','cPassword')}
        );
    }
    
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
    
    validatePasswords(formGroup: FormGroup): any {
        const password = formGroup.controls['nPassword'];
        const confirmPassword = formGroup.controls['cPassword'];
    
        // don't validate
        if (password.pristine || confirmPassword.pristine) {
          return null;
        }
    
        formGroup.markAsTouched();
    
        if (password.value === confirmPassword.value) {
          return null;
        }
    
        return confirmPassword.setErrors({
          notEqual: true
        });
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
        console.log('SUCCESS!! :-)\n\n' + JSON.stringify(this.registerForm.value))
        this.userService.register(this.registerForm.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.alertService.success('Registration successful', true);
                    this.router.navigate(['/login']);
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }
}
