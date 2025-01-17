import { Injectable } from '@angular/core';
import {Company} from './models/company.model';
import {AngularFireDatabase} from '@angular/fire/database';
import {AuthService} from '../user-authentication/auth.service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {TrialBalance} from './models/trial-balance.model';
import 'rxjs/add/operator/map'
import {UserModel} from './models/user.model';
import {AccountModel} from './models/account.model';
import {ClassificationService} from './classification.service';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  companies = new Array();
  //TODO: Replace with query parameter
  selectedCompany: Company;
  dataSource: Observable<any>
  companiesObservable: Observable<any>;
  companyUsers:UserModel[] = new Array();

  constructor(private db: AngularFireDatabase, private authService: AuthService,
              private http: HttpClient,private classification: ClassificationService) {
    this.fetchCompanies()
      .subscribe(companiesSnapshot => {
        companiesSnapshot.forEach(company => {
          if(!this.getCompanyById(company.key)) {
            this.companies.push(new Company(company.key, company.payload.val().name, company.payload.val().email,
              company.payload.val().phone, company.payload.val().address, company.payload.val().city,
              company.payload.val().state, company.payload.val().zip, company.payload.val().url, company.payload.val().realm));
          }
        });
      });
  }

  fetchCompanies(){
    this.companiesObservable = this.db.list<Company>('user-companies/'+this.authService.user.uid).snapshotChanges(["child_added"])
    return this.companiesObservable;
  }

  getCompanyById(id: string){
    for(let company of this.companies){
      if(company.companyId === id){
        return company;
      }
    }
  }

  updateCompany(company: Company){
    return this.db.list('user-companies/'+this.authService.user.uid).update(company.companyId,company)
  }

  addAccounts(company: Company, trialBalance: TrialBalance){
    for(let account of trialBalance.accounts){
      var accountExists = company.companyAccounts.filter(acct =>{
        return account.id ===acct.id;
      })
      if(accountExists.length===0){
        company.companyAccounts.push(account);
      }
    }

  }

  fetchTrialBalances(companyId: string): Observable<any>{
    var tbProcessed = 0;
    return new Observable((observer) => {
      var company: Company =  this.getCompanyById(companyId);
      this.db.list<TrialBalance>('company-data/' + companyId,
        ref => ref.orderByChild("startPeriod")).valueChanges()
          .subscribe((ref) =>{
            company.trialBalanceList=[]
            company.companyAccounts=[]
            ref.forEach(trialBalance => {
              company.trialBalanceList.splice(0,0,trialBalance);
              this.addAccounts(company, trialBalance)
              var  t = ref.length
              if (tbProcessed === t-1) {
                observer.next();
                observer.complete()
                return
              }
              tbProcessed++;
            });
          })
    })
  }

  editAccountSubcategory(account: AccountModel, newSubCategory: string){
    return new Observable(observer=>{
     var category =  this.classification.classification.filter(acct =>{
        return acct.subCategory===account.subCategory
      });
     //TODO: Check if compayId is set when creating company
    this.db.list('company-data/'+this.selectedCompany.companyId).query.once("value")
      .then((trialBalanceArray)=>{
        trialBalanceArray.forEach(trialBalance => {
          // console.log(trialBalance.key);
          this.db.list('/company-data/'+this.selectedCompany.companyId+'/'+trialBalance.key+'/accounts',
              ref => ref.orderByChild('id').equalTo(account.id)).query.once('value')
            .then((ref)=>{
              ref.forEach(acc=>{
                this.db.object('/company-data/'+this.selectedCompany.companyId+'/'+trialBalance.key+'/accounts/'+acc.key)
                  .update({category: category[0].category, subCategory: newSubCategory})
                  .then(()=>{
                    observer.next();
                    observer.complete();
                  })
              })
            })
        });
      })
    })
  }

  fetchCompanyUsers(companyId: string){
    return new Observable((observer) => {
      this.db.list('/company-users/'+companyId).snapshotChanges()
        .subscribe(userKeys => {
          this.companyUsers = [];
          userKeys.forEach(x => {
            this.db.object<UserModel>('user/' + x.key).valueChanges()
              .subscribe(user => {
                user.role = x.payload.val().toString();
                user.id = x.key;
                this.companyUsers.push(user);
              })
          })
          observer.next();
          observer.complete();
        });
    });
  }

  removeUserFromCompany(userId: string){
    return new Observable (observer =>{
      this.db.object("company-users/"+this.selectedCompany.companyId+"/"+userId).remove()
        .then(() => {
          this.db.object("user-companies/"+userId+"/"+this.selectedCompany.companyId).remove()
            .then(()=>{
              observer.next();
              observer.complete()
            })
        })
    })
  }

  changeUserRole(userToEdit: UserModel,  newRole: string){
    return new Observable (observer =>{
      this.db.object("company-users/"+this.selectedCompany.companyId+"/"+userToEdit.id).set(newRole)
        .then(() => {
          observer.next();
          observer.complete()
        })
    })

  }

  createUserInviteRequest(userEmail: string, userRole){
    return new Observable((observer) => {
      const itemRef = this.db.list("invite-request");
      itemRef.push({email: userEmail, role: userRole, companyId: this.selectedCompany.companyId, senderId: this.authService.user.uid})
        .then(ref=>{
          observer.next();
          observer.complete()
        }).catch(err =>{
        observer.error(err.message)
      });
    });
  }

  /**
   * Determines if the user with userId is an Admin
   * @param {string} userId
   * @returns {boolean}
   */
  isAdmin(userId: string){
    var editor = this.companyUsers.filter(usr=>{
      return usr.id === userId;
    })
    if(editor[0].role==="Admin")return true;
    return false;
  }
  fetchCompanySource(companyId: string, realmId: string){
    this.dataSource = this.http.post("https://fluencyanalysis-backend.herokuapp.com/get_company_data",
      {
        "companyId": companyId,
        "realmId": realmId
      })
    return this.dataSource;

  }

  updateCompanySource(){
    this.dataSource = this.http.post("https://fluencyanalysis-backend.herokuapp.com/update_company_data",
      {
        "companyId": this.selectedCompany.companyId
      })
    return this.dataSource;

  }

}
