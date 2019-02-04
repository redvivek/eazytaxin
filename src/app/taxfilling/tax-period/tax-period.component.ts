import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup,FormControl, Validators } from '@angular/forms';
import {  FileUploader, FileSelectDirective } from 'ng2-file-upload/ng2-file-upload';

import { AlertService, UserService,AuthenticationService } from '@app/_services';

@Component({
  selector: 'app-tax-period',
  templateUrl: './tax-period.component.html',
  styleUrls: ['./tax-period.component.css']
})
export class TaxPeriodComponent implements OnInit {
  taxPeriodForm: FormGroup;
  loading = false;
  submitted = false;


  taxperiods = ['2019-2020', '2018-2019', '2017-2018'];



  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private alertService: AlertService,
    private cd: ChangeDetectorRef
  )
  {
      // redirect to login if not logged in
      if (!this.authenticationService.currentUserValue) { 
        this.router.navigate(['/login']);
      }
  }

  ngOnInit() {
    this.taxPeriodForm = this.formBuilder.group({
        taxperiod: ['', Validators.required],
        xmluploadflag : ['0',Validators.required],
        uploadPreFillXMLFile : [null,Validators.required]
    });

  }

  // convenience getter for easy access to form fields
  get f() { return this.taxPeriodForm.controls; }

  onFileChange(event) {
    const reader = new FileReader();
 
    if(event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
  
      reader.onload = () => {
        this.taxPeriodForm.patchValue({
          uploadPreFillXMLFile: reader.result
       });
      
        // need to run CD since file load runs outside of zone
        this.cd.markForCheck();
      };
    }
  }

  onSubmit() {
      this.submitted = true;

      // stop here if form is invalid
      if (this.taxPeriodForm.invalid) {
          return;
      }

      this.loading = true;
      console.log('Input Values :-)\n\n' + JSON.stringify(this.taxPeriodForm.value));
  }



}
