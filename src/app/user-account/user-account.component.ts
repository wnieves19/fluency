import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import {AuthService} from '../user-authentication/auth.service';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-user-account',
  templateUrl: './user-account.component.html',
  styleUrls: ['./user-account.component.css']
})
export class UserAccountComponent implements OnInit {
  firstName = new FormControl('');
  lastName = new FormControl('');
  email = new FormControl('');
  phone = new FormControl('');

  constructor(private authService: AuthService,private snackBar: MatSnackBar) { }

  ngOnInit() {

    this.firstName.setValue(this.authService.account.firstName);
    this.lastName.setValue(this.authService.account.lastName);
    this.email.setValue(this.authService.account.email);
    this.phone.setValue(this.authService.account.phone);
  }


  saveProfile(){
    this.authService.account.firstName = this.firstName.value;
    this.authService.account.lastName = this.lastName.value;
    this.authService.account.email = this.email.value;
    this.authService.account.phone = this.phone.value;

    this.authService.saveProfile().then(_ => {this.snackBar.open('Profile saved','Close',{
      duration: 2000,
    })
    })
      .catch(err => console.log(err, 'You do not have access!'));
  }

}
