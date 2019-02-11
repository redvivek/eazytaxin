import { Component, OnInit,OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup,FormControl, Validators } from '@angular/forms';
import { User } from '@app/_models';
import { UserService, AuthenticationService } from '@app/_services';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit , OnDestroy {

  currentUser: User;
  currentUserSubscription: Subscription;
  users: User[] = [];
  assesmentYears = [];
  selectedAssYear:any;

  constructor(
        private formBuilder: FormBuilder,
        private authenticationService: AuthenticationService,
        private userService: UserService
  ) {
      this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
          this.currentUser = user;
      });
    }

    ngOnInit() {
        this.assesmentYears = this.getCurrentAssesmentYear();
        console.log("Current Assesment Year "+this.assesmentYears);
        this.selectedAssYear = this.assesmentYears[0];
    }

    onChange(newValue) {
        console.log(newValue);
        this.selectedAssYear = newValue;
    }

    ngOnDestroy() { 
      // unsubscribe to ensure no memory leaks
      this.currentUserSubscription.unsubscribe();
    }

    getCurrentAssesmentYear() {
        var currentAYear = "";
        var prevAYear = "";
        var prevLAYear = "";
        var assYearList = [];
        var today = new Date();
        if ((today.getMonth() + 1) <= 3) {
            currentAYear = today.getFullYear() + "-" + (today.getFullYear()+1);
        } else {
            currentAYear = (today.getFullYear()+1) + "-" + (today.getFullYear() + 2);
        }

        if ((today.getMonth() + 1) <= 3) {
            prevAYear = (today.getFullYear()-1) + "-" + today.getFullYear();
        } else {
            prevAYear = today.getFullYear() + "-" + (today.getFullYear() + 1);
        }

        if ((today.getMonth() + 1) <= 3) {
            prevLAYear = (today.getFullYear()-2) + "-" + (today.getFullYear()-1);
        } else {
            prevLAYear = (today.getFullYear()-1) + "-" + today.getFullYear() + 1;
        }
        assYearList.push(currentAYear);
        assYearList.push(prevAYear);
        assYearList.push(prevLAYear);
        return assYearList;
    }
}
