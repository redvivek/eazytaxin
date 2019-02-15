import { Component, OnInit } from '@angular/core';
import { ScriptService,AlertService, AuthenticationService,ApplicationService } from '@app/_services';

@Component({
  selector: 'app-reviewdetails',
  templateUrl: './reviewdetails.component.html',
  styleUrls: ['./reviewdetails.component.css']
})
export class ReviewdetailsComponent implements OnInit {

  constructor(
    private scriptservice : ScriptService
    ) 
  {
  	this.scriptservice.load('mainJS').then(data => {
  	    console.log('script loaded ', data);
  	}).catch(error => console.log(error));  
  }

  ngOnInit() {
  }

}
