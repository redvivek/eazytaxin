import { Component, OnInit } from '@angular/core';
import { ScriptService,AuthenticationService,ApplicationService, AlertService } from '@app/_services';

@Component({
  selector: 'app-deductions',
  templateUrl: './deductions.component.html',
  styleUrls: ['./deductions.component.css']
})
export class DeductionsComponent implements OnInit {

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
