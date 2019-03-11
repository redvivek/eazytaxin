import { Component, OnInit ,ViewChild,ElementRef ,AfterContentInit, AfterViewInit} from '@angular/core';
import { Router } from '@angular/router';
import { ScriptService,AlertService, AuthenticationService,ApplicationService } from '@app/_services';
import { handleHeaderBackground,handleSmoothScroll } from '../app.helpers';
//import * as $ from 'jquery';
declare var $ : any;
@Component({ templateUrl: 'home.component.html' })

export class HomeComponent implements OnInit,AfterContentInit,AfterViewInit{
	@ViewChild('carousel') el:ElementRef;
	constructor(
		private router: Router
	) {	}

  ngOnInit() {
		
	}
	
	ngAfterViewInit(){
		handleHeaderBackground();
		handleSmoothScroll();
	}
	ngAfterContentInit(): void {
    //console.log(this.el);
    $(this.el.nativeElement).owlCarousel({
			items: 1,
			loop: true,
			autoplay: true,
			onInitialized: this.startProgressBar(),
			onTranslate: this.resetProgressBar(),
			onTranslated: this.startProgressBar()
		});
  }

	startProgressBar() {
		// apply keyframe animation
		$(".slide-progress").css({
			width: "100%",
			transition: "width 5000ms"
		});
	}

	resetProgressBar() {
		$(".slide-progress").css({
			width: 0,
			transition: "width 0s"
		});
	}
	
	goTaxFilling(){
    this.router.navigate(['/taxfilling']);
  }
	goPricing(){
    this.router.navigate(['/pricing']);
  }
}