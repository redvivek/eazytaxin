import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup,FormControl, Validators } from '@angular/forms';
import { FileSelectDirective, FileDropDirective, FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { environment } from '@environments/environment';
import { AlertService, UserService,AuthenticationService } from '@app/_services';

const URL = `${environment.apiUrl}/tax/uploadxml`;

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
  public uploader: FileUploader = new FileUploader({
    url: URL, 
    itemAlias: 'uploadPreFillXMLFile'
  });


  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private alertService: AlertService,
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
        xmluploadflag : ['',Validators.required],
        uploadPreFillXMLFile : [null,Validators.required]
    });
    
    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
    this.uploader.onBuildItemForm = (fileItem: any, form: any) => {
      form.append('AppRefNo', 'abcd123'); //note comma separating key and value
      form.append('UserId', this.authenticationService.currentUserValue.userid);
      form.append('AssesmentYear', '2019-2020');
      form.append('XmlUploadFlag', 1);
      form.append('ApplicationStatus', 'Initiated');
      form.append('DocCategory', 'PreUpload');
     };
    

    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
          console.log('ImageUpload:uploaded:', item, status, response);
          alert('File uploaded successfully');
      };
  }

  // convenience getter for easy access to form fields
  get f() { return this.taxPeriodForm.controls; }

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
