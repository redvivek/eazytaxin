import { Component, OnInit } from '@angular/core';
import { ScriptService,AlertService, AuthenticationService,ApplicationService } from '@app/_services';

@Component({ templateUrl: 'home.component.html' })

export class HomeComponent implements OnInit{
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