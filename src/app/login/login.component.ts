import { Component, OnInit ,AfterViewInit} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import {AlertService, UserService,AuthenticationService } from '@app/_services';
import * as Waves from 'node-waves';
import { handleInsideHeaderBackground,handleFloatingLabels } from '../app.helpers';

@Component({templateUrl: 'login.component.html'})
export class LoginComponent implements OnInit,AfterViewInit {
    loginForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;

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
    }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
    }

    ngAfterViewInit(){
        handleInsideHeaderBackground();
        handleFloatingLabels(Waves);
    }

    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }

        this.loading = true;
        this.authenticationService.login(this.f.username.value, this.f.password.value)
        .pipe(first())
        .subscribe(
            data => {
                console.log("Response"+JSON.stringify(data));
                if(data['Message'] == 'Invalid Cred'){
                    this.alertService.error('Username or Password is invalid');
                    this.loading = false;
                }else if(data['Message'] == 'Valid User'){
                    this.alertService.success('Login successful', true);
                    this.router.navigate([this.returnUrl]);
                    this.loading = false;
                }else if(data['Message'] == 'Inactive User'){
                    this.userService.changeMessage(data['userid']);
                    this.router.navigate(['/activateuser']);
                    this.loading = false;
                }else{
                    this.alertService.error('Not a valid user. Please signup!!');
                    this.loading = false;
                }    
            },
            error => {
                console.log("Login error"+JSON.stringify(error));
                this.alertService.error('Username or Password is invalid');
                this.loading = false;
            });
    }
}
