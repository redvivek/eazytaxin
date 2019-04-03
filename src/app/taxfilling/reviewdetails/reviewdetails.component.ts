import { Component, OnInit,AfterViewInit } from '@angular/core';
import { ScriptService,AlertService, AuthenticationService,ApplicationService } from '@app/_services';
import { handleInsideHeaderBackground,handleFloatingLabels,formSticky } from '../../app.helpers';
import * as Waves from 'node-waves';

@Component({
  selector: 'app-reviewdetails',
  templateUrl: './reviewdetails.component.html',
  styleUrls: ['./reviewdetails.component.css']
})
export class ReviewdetailsComponent implements OnInit,AfterViewInit {

  constructor(
    private scriptservice : ScriptService
    ) 
  {
  	this.scriptservice.load('d3JS','mainJS','reviewJS').then(data => {
  	    console.log('script loaded ', data);
  	}).catch(error => console.log(error));  
  }

  ngOnInit() {
  }

  ngAfterViewInit(){
    handleInsideHeaderBackground();
    formSticky();
	}

}
