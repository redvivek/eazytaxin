import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { ScriptService,AuthenticationService } from '@app/_services';
import { User } from '@app/_models';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit,AfterViewInit {

    currentUser: User;
    isLoggedIn$: Observable<boolean>;

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private scriptservice : ScriptService
    ) {
        this.scriptservice.load('headerJS').then(data => {
            console.log('script loaded ', data);
        }).catch(error => console.log(error));
        this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    }


  ngOnInit() {
    //this.currentUser = this.authenticationService.currentUserValue;
  }

  ngAfterViewInit(){
    //$.getScript('../../assets/js/header.js');
    //$.getScript('../../assets/js/header.js', function(){});
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/home']);
  }

  goDashboard(){
    this.router.navigate(['/dashboard']);
  }

  goLogin(){
    this.router.navigate(['/login']);
  }

  goHome(){
    this.router.navigate(['/home']);
  }

  goContactus(){
    this.router.navigate(['/contactus']);
  }

}
	