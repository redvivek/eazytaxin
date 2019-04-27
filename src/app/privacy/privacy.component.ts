import { Component, OnInit,AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import * as Waves from 'node-waves';
import { handleInsideHeaderBackground,handleFloatingLabels } from '../app.helpers';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.css']
})
export class PrivacyComponent implements OnInit,AfterViewInit {

  constructor(
    private router: Router,
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit(){
    handleInsideHeaderBackground();
    handleFloatingLabels(Waves);
  }

}
