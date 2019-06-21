import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Params, Router,} from '@angular/router';
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
  constructor(private db: AngularFireDatabase, private authService: AuthService,private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.signUpForm = new FormGroup({
      name: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      confirm: new FormControl('', Validators.required),
    });

    this.route.queryParams.subscribe(
      (queryParams: Params) => {
        if (queryParams['inviteId']) {
          this.inviteRequestId = queryParams['inviteId']
        }else{
          this.signUpForm.addControl("email", new FormControl('', [Validators.required, Validators.email]))
        }
      })
  }

  signUp(){
    if(this.signUpForm.get('password').value!==this.signUpForm.get('confirm').value){
      this.error = "Passwords don't match";
      return;
    }
    /**Process sign up of User accepting app invite */
    if(this.inviteRequestId) {
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

      /** Process sign up normal flow*/
    }else{
      let email = this.signUpForm.get('email').value;
      let name = this.signUpForm.get('name').value;
      let lastName = this.signUpForm.get('lastName').value;
      let userAccount = new UserAccount(name, lastName, email)

      this.authService.signUpNewUser(userAccount, this.signUpForm.get('password').value)
        .subscribe(userCredential =>{

        }, errorMessage =>{
          this.error = errorMessage;
        })
    }

  }
  returnLogin(){
    this.router.navigate(['login']);
  }

}
