import { Component,HostListener,Inject, OnInit ,ViewChild,ElementRef ,AfterContentInit, AfterViewInit} from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/platform-browser';
import { ScriptService,AlertService, AuthenticationService,ApplicationService } from '@app/_services';
import { handleHeaderBackground,handleInsideHeaderBackground,makeSelectedMenuActiveProp } from '../app.helpers';
import { WINDOW } from "@app/_services/window.service";
//import * as $ from 'jquery';
declare var $ : any;
@Component({ templateUrl: 'home.component.html' })

export class HomeComponent implements OnInit,AfterContentInit,AfterViewInit{
	@ViewChild('carousel') el:ElementRef;
	constructor(
		private router: Router,
		@Inject(DOCUMENT) private document: Document,
    @Inject(WINDOW) private window
	) {	}

	@HostListener("window:scroll", [])
	onWindowScroll() {
    let number = this.window.pageYOffset || this.document.documentElement.scrollTop || this.document.body.scrollTop || 0;
		let topoffset = this.window.offsettop || this.document.documentElement.offsetTop || this.document.body.offsetTop || 0 ;
		if (number > 500) {
      handleInsideHeaderBackground();
    } else {
			handleHeaderBackground();
		}
		makeSelectedMenuActiveProp(number,topoffset);
  }

  ngOnInit() {
		handleHeaderBackground();
	}
	
	ngAfterViewInit(){}

	ngAfterContentInit(): void {
    //console.log(this.el);
    $(this.el.nativeElement).owlCarousel({
			items: 1,
			loop: true,
			autoplay: false,
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