import { Component, OnInit,AfterViewInit } from '@angular/core';

import * as Waves from 'node-waves';
import { handleFloatingLabels } from '../app.helpers';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.css']
})
export class ForgotpasswordComponent implements OnInit,AfterViewInit {

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit(){
      handleFloatingLabels(Waves);
  }

}
