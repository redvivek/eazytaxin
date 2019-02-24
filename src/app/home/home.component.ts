import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ScriptService,AlertService, AuthenticationService,ApplicationService } from '@app/_services';

@Component({ templateUrl: 'home.component.html' })

export class HomeComponent implements OnInit{
	constructor(
		private scriptservice : ScriptService,
		private router: Router
	  ) 
	{
		 this.scriptservice.load('owlCJS','staticJS').then(data => {
		    console.log('script loaded ', data);
		}).catch(error => console.log(error));   
	}

  ngOnInit() {
	}
	
	goTaxFilling(){
    this.router.navigate(['/taxfilling']);
  }
}