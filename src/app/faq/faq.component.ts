import { Component, OnInit } from '@angular/core';

import { handleInsideHeaderBackground,handleFloatingLabels } from '../app.helpers';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit(){
    handleInsideHeaderBackground();
  }

}
