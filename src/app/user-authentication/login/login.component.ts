import { Component, OnInit } from '@angular/core';
import {AuthService} from '../auth.service';
import {AngularFireDatabase} from '@angular/fire/database';
import {FormControl} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email = new FormControl('');
  password = new FormControl('');
  error:string;
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.authService.afAuth.authState.subscribe(user => {
      if (user){
        this.router.navigate(['/company-management/']);
      }
      else{

      }
    })
  }

  signUpClicked(){
    this.router.navigate(['/signup/']);
  }

  loginClicked(){
    this.authService.login(this.email.value, this.password.value)
      .then((user) => {
      if(!user){
        console.log("Credentials not valid");
      }
    }).catch(error => {
      console.log(error.message)
      this.error = error.message;
    });
  }

}
