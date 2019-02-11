import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidemenus',
  templateUrl: './sidemenus.component.html',
  styleUrls: ['./sidemenus.component.css']
})
export class SidemenusComponent implements OnInit {

  constructor(
    private router: Router,
  ) { }

  ngOnInit() {
  }

  goHome(){
    this.router.navigate(['/home']);
  }

  goPlans(){
    this.router.navigate(['/plans']);
  }

  goTaxFilling(){
    this.router.navigate(['/taxfilling']);
  }

}
