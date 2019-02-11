import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthenticationService } from '@app/_services';
import { User } from '@app/_models';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

    currentUser: User;
    isLoggedIn$: Observable<boolean>;

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) {
        this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    }


  ngOnInit() {
    //this.currentUser = this.authenticationService.currentUserValue;
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

  goDashboard(){
    this.router.navigate(['/dashboard']);
  }

}
	