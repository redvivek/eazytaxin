import { Component, OnInit,AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { ScriptService,AlertService, AuthenticationService,ApplicationService } from '@app/_services';
import { handleInsideHeaderBackground,formSticky } from '../../app.helpers';

@Component({
  selector: 'app-reviewdetails',
  templateUrl: './reviewdetails.component.html',
  styleUrls: ['./reviewdetails.component.css']
})
export class ReviewdetailsComponent implements OnInit,AfterViewInit {

  //Global variables to save userdId and ApplictionID
  userId : number;
  ApplicationId : number;
  nextButtonDisable = false;
  previousButtonDisable = false;

  //Read localstorage in progress application values
  localStoreg = JSON.parse(localStorage.getItem("currentUserApp"));

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private appService : ApplicationService,
    private alertService : AlertService,
    private scriptservice : ScriptService
    ) 
  {   
      this.scriptservice.load('d3JS','mainJS','reviewJS').then(data => {
          console.log('script loaded ', data);
      }).catch(error => console.log(error));
      //console.log("Current user value "+ JSON.stringify(this.authenticationService.currentUserValue));
      //console.log("Current App value "+ this.appService.currentApplicationValue);
      this.userId         = this.authenticationService.currentUserValue.userid;
      if(this.appService.currentApplicationValue != null){
        this.ApplicationId  = this.appService.currentApplicationValue.appId;
      }else{
        this.nextButtonDisable = true;
        this.previousButtonDisable = true;
      }
      //console.log("Current App Id "+ this.ApplicationId);
  }

  ngOnInit() {
  }

  ngAfterViewInit(){
    handleInsideHeaderBackground();
    formSticky();
  }
  
  //Function Called on next button click
  on_next_click(){
    this.router.navigate(['taxfilling/payment']);
  }

  //Function Called on previous button click
  on_previous_click(){
    this.router.navigate(['taxfilling/taxpaid']);
  }

}

