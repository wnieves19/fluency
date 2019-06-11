import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Params,} from '@angular/router';
import {AuthService} from '../auth.service';
import {AngularFireDatabase} from '@angular/fire/database';
import {UserAccount} from '../user-account.model';
import {passBoolean} from 'protractor/built/util';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  signUpForm: FormGroup
  inviteRequestId;
  error
  constructor(private db: AngularFireDatabase, private authService: AuthService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.signUpForm = new FormGroup({
      name: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      // email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
      confirm: new FormControl('', Validators.required),
    });

    this.route.queryParams.subscribe(
      (queryParams: Params) => {
        if (queryParams['inviteId']) {
          this.inviteRequestId = queryParams['inviteId']
        }
      })
  }

  signUp(){
    if(this.signUpForm.get('password').value!==this.signUpForm.get('confirm').value){
      this.error = "Passwords don't match";
      return;
    }
    if(this.inviteRequestId) { //Process User accepting invite
      this.db.object('invite-request/' + this.inviteRequestId).query.once("value")
        .then(snapshot => {
          let email = snapshot.val().email;
          let name = this.signUpForm.get('name').value;
          let lastName = this.signUpForm.get('lastName').value;
          let userAccount = new UserAccount(name, lastName, email)
          this.authService.createUserWithCompany(userAccount, this.signUpForm.get('password').value, snapshot.val().companyId, snapshot.val().role, this.inviteRequestId)
            .subscribe(userCredential => {
              console.log(userCredential.user.getIdToken());
            }, errorMessage=> {
              this.error = errorMessage;
            })
          console.log(this.inviteRequestId);
        }).catch(err => {
        this.error = err.message;
      });
    }else{//Process sign up normal flow

    }

  }

}
