import { Injectable } from '@angular/core';
import {User} from 'firebase';
import { AngularFireAuth } from  "@angular/fire/auth";
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: User;
  constructor(public  afAuth:  AngularFireAuth, private router: Router) {

    this.afAuth.authState.subscribe(user => {
      if (user){
        this.user = user;
        console.log("User Id: "+ this.user.uid)
      }
      else{
        console.log("Not LoggedIn")
        this.router.navigate(['/'])

      }
    })
  }

  async login(email: string, password: string){
   return await this.afAuth.auth.signInWithEmailAndPassword(email, password);

  }

  logout(){
    this.afAuth.auth.signOut();
  }
}
