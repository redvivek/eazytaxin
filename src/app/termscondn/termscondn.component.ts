import { Component, OnInit,AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
//import { FormBuilder, FormGroup,FormControl, Validators } from '@angular/forms';
//import { first } from 'rxjs/operators';

//import {AlertService, UserService, AuthenticationService } from '@app/_services';
import * as Waves from 'node-waves';
import { handleInsideHeaderBackground,handleFloatingLabels } from '../app.helpers';

@Component({
  selector: 'app-termscondn',
  templateUrl: './termscondn.component.html',
  styleUrls: ['./termscondn.component.css']
})
export class TermscondnComponent implements OnInit,AfterViewInit{

  constructor(
    //private formBuilder: FormBuilder,
    private router: Router,
    //private authenticationService: AuthenticationService,
    //private userService: UserService,
    //private alertService: AlertService
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit(){
    handleInsideHeaderBackground();
    handleFloatingLabels(Waves);
  }

}
