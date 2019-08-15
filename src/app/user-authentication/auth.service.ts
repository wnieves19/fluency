import { Injectable } from '@angular/core';
import {User} from 'firebase';
import { AngularFireAuth } from  "@angular/fire/auth";
import {Router} from '@angular/router';
import {AngularFireDatabase} from '@angular/fire/database';
import {Observable} from 'rxjs';
import {UserAccount} from './user-account.model';
import {DataSnapshot} from '@angular/fire/database/interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: User;
  account: UserAccount;
  accountListner: Observable<any>;
  constructor(private db: AngularFireDatabase, public  afAuth: AngularFireAuth, private router: Router) {

    this.afAuth.authState.subscribe(user => {
      if (user){
        this.user = user;
        this.accountListner = db.object('user/'+ this.user.uid).valueChanges();
        this.accountListner.subscribe(account => {
          this.account = account;
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
    const itemsRef = this.db.list('user/');
    return itemsRef.update(this.user.uid, this.account);
  }
//TODO: Unchain promises
  createUserWithCompany(userAccount: UserAccount, password:string, companyId: string, role: string, inviteId: string): Observable<any>{
    return new Observable((observer)=>{
      this.afAuth.auth.createUserWithEmailAndPassword(userAccount.email, password)
        .then(userCredentials =>{
          //create user
          const userReference = this.db.object("user/"+userCredentials.user.uid);
          userReference.set(userAccount)
            .then(ref=>{
              //fetch company and create user-companies
              this.db.object('companies/'+companyId).query.once("value")
                .then(companySnapshot=>{
                  const userCompaniesRef =  this.db.object("user-companies/"+userCredentials.user.uid+"/"+companyId);
                  userCompaniesRef.set(this.getCompanyObjetcFromSnapshot(companySnapshot))
                    .then(value => {
                      //create company-users
                      this.db.object("company-users/"+companyId+"/"+userCredentials.user.uid).set(role)
                        .then(value=>{
                          this.db.object("invite-request/"+inviteId).remove();
                          observer.next(userCredentials)
                          observer.complete()
                        });
                    })
                })
            });
        }).catch(err=>{
        observer.error(err.message)
      })
    })

  }

  signUpNewUser(userAccount: UserAccount, password){
    return new Observable((observer)=>{
      this.afAuth.auth.createUserWithEmailAndPassword(userAccount.email, password)
        .then(userCredentials =>{
          //create user
          const userReference = this.db.object("user/"+userCredentials.user.uid);
          userReference.set(userAccount)
            .then(ref=>{
              observer.next(userCredentials)
              observer.complete()
            });
        }).catch(err=>{
        observer.error(err.message)
      })
    })
  }

  sendPasswordResetEmail(email: string){
    return new Observable((observer)=> {
      this.afAuth.auth.sendPasswordResetEmail(email)
        .then(function(){
          observer.next()
          observer.complete()
        }).catch(function (error) {
          observer.error(error)
          console.log(error)
      })
    });
  }

  getCompanyObjetcFromSnapshot(snapshot: DataSnapshot){
    let companyObject =
      {
        address : snapshot.val().address || "",
        city : snapshot.val().city || "",
        companyId : snapshot.val().companyId || "",
        email : snapshot.val().email || "",
        name : snapshot.val().name || "",
        phone : snapshot.val().phone || "",
        realm : snapshot.val().realm || "",
        refreshToken : snapshot.val().refreshToken || "",
        source : snapshot.val().source || "",
        state : snapshot.val().state || "",
        token : snapshot.val().token || "",
        url : snapshot.val().url || "",
        zip : snapshot.val().zip || "",
      }
    return companyObject;
  }

  logout(){
    this.afAuth.auth.signOut();
  }

}
