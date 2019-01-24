import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl , Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Basicinfostep1, Personalinfo, Address, Bankdetail, Assetsliabilities } from '@app/_models';

@Component({
  selector: 'app-personal-details',
  templateUrl: './personal-details.component.html',
  styleUrls: ['./personal-details.component.css']
})
export class PersonalDetailsComponent implements OnInit {

  constructor() { }

  ngOnInit() { }

}
