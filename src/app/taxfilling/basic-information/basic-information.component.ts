import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup,FormControl, Validators } from '@angular/forms';

import { AlertService, UserService,AuthenticationService } from '@app/_services';

@Component({
  selector: 'app-basic-information',
  templateUrl: './basic-information.component.html',
  styleUrls: ['./basic-information.component.css']
})
export class BasicInformationComponent implements OnInit {
  basicInfoForm: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
  ) { 
      // redirect to login if not logged in
      if (!this.authenticationService.currentUserValue) { 
        this.router.navigate(['/login']);
      }
  }

  ngOnInit() {
    this.basicInfoForm = this.formBuilder.group({
        //taxperiod: ['', Validators.required],
        //xmluploadflag : ['0',Validators.required],
        //uploadPreFillXMLFile : [null,Validators.required]
    });
  }

}
