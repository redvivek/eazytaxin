import { Component, OnInit } from '@angular/core';

import { ScriptService } from '@app/_services';

@Component({
  selector: 'app-income-source',
  templateUrl: './income-source.component.html',
  styleUrls: ['./income-source.component.css']
})
export class IncomeSourceComponent implements OnInit {

  constructor( 
    private scriptservice : ScriptService
  ) {
    this.scriptservice.load('mainJS').then(data => {
      console.log('script loaded ', data);
    }).catch(error => console.log(error));
  }

  ngOnInit() {
  }

}
