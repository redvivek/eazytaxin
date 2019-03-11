import { Component, OnInit,AfterViewInit } from '@angular/core';
import { handleInsideHeaderBackground,handleFloatingLabels } from '../../app.helpers';
import * as Waves from 'node-waves';

@Component({
  selector: 'app-taxes-paid',
  templateUrl: './taxes-paid.component.html',
  styleUrls: ['./taxes-paid.component.css']
})
export class TaxesPaidComponent implements OnInit,AfterViewInit {

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit(){
    handleInsideHeaderBackground();
    handleFloatingLabels(Waves);
	}

}
