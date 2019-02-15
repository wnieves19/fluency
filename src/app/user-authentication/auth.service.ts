import { Injectable } from '@angular/core';
import {User} from 'firebase';
import { AngularFireAuth } from  "@angular/fire/auth";
import {Router} from '@angular/router';
import {AngularFireDatabase} from '@angular/fire/database';
import {Observable} from 'rxjs';
import {UserAccount} from './user-account.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: User;
  account: UserAccount;
  accountListner: Observable<any>;
  constructor(private db: AngularFireDatabase, public  afAuth:  AngularFireAuth, private router: Router) {

    this.afAuth.authState.subscribe(user => {
      if (user){
        this.user = user;
        this.accountListner = db.object('account/'+ this.user.uid).valueChanges();
        this.accountListner.subscribe(account => {
          this.account = account;
          console.log(account)
        });
      }
      else{
        this.router.navigate(['/'])

      }
    })
  }

  async login(email: string, password: string){
    return await this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }


  async saveProfile(){
    const itemsRef = this.db.list('account/');
    return itemsRef.update(this.user.uid, this.account);
  }

  logout(){
    this.afAuth.auth.signOut();
  }

}
