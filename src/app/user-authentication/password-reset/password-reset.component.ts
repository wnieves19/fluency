import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../auth.service';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent implements OnInit {
  email = new FormControl('');
  error;
  constructor(private router: Router,private snackBar: MatSnackBar, private authService: AuthService) { }

  ngOnInit() {
  }

  requestPasswordReset(){
    this.authService.sendPasswordResetEmail(this.email.value)
      .subscribe(()=>{this.snackBar.open('Reset password sent ','Close',{
        duration: 2000,
      })
        this.router.navigate(['login']);
      },errorMessage=>{
        this.error = errorMessage
      })
  }
  returnLogin(){
    this.router.navigate(['login']);
  }
}
