import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../user-authentication/auth.service';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-user-account',
  templateUrl: './user-account.component.html',
  styleUrls: ['./user-account.component.css']
})
export class UserAccountComponent implements OnInit{

  profileForm: FormGroup;
  subscription;

  constructor(private authService: AuthService,private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.profileForm = new FormGroup({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', Validators.required)
    })

    this.setProfileFields()

    this.authService.accountListner.subscribe(account => {
      this.setProfileFields()
      console.log(account)
    });

  }

  setProfileFields(){
    this.profileForm.get('firstName').setValue(this.authService.account.firstName);
    this.profileForm.get('lastName').setValue(this.authService.account.lastName);
    this.profileForm.get('email').setValue(this.authService.account.email);
    this.profileForm.get('phone').setValue(this.authService.account.phone);
  }


  saveProfile(){
    this.authService.account.firstName =  this.profileForm.get('firstName').value
    this.authService.account.lastName = this.profileForm.get('lastName').value
    this.authService.account.email = this.profileForm.get('email').value
    this.authService.account.phone = this.profileForm.get('phone').value

    this.authService.saveProfile().then(_ => {this.snackBar.open('Profile saved','Close',{
      duration: 2000,
    })
    })
      .catch(err => console.log(err, 'You do not have access!'));
  }



}
