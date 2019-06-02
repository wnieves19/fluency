import { Injectable } from '@angular/core';
import {Company} from './models/company.model';
import {AngularFireDatabase, AngularFireList} from '@angular/fire/database';
import {AuthService} from '../user-authentication/auth.service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {TrialBalance} from './models/trial-balance.model';
import 'rxjs/add/operator/map'
import {UserModel} from './models/user.model';

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

  constructor(private db: AngularFireDatabase, private authService: AuthService, private http: HttpClient ) {
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

  fetchTrialBalances(companyId: string): Observable<any>{
    var tbProcessed = 0;
    return new Observable((observer) => {
      this.getCompanyById(companyId).trialBalanceList=[]
      this.db.list<TrialBalance>('company-data/' + companyId).valueChanges()
        .subscribe((trialBalanceArray) => {
          trialBalanceArray.forEach(trialBalance => {
            this.getCompanyById(companyId).trialBalanceList.push(trialBalance);
            tbProcessed++;
            if (tbProcessed === trialBalanceArray.length) {
              observer.next();
              observer.complete()
            }
          });
        })
    })
  }

  fetchCompanyUsers(companyId: string){
    this.companyUsers = [];
    return new Observable((observer) => {
      this.db.list('/company-users/'+companyId).snapshotChanges()
        .subscribe(userKeys => {
          userKeys.forEach(x => {
            this.db.object<UserModel>('user/' + x.key).valueChanges()
              .subscribe(user => {
                user.role = x.payload.val().toString();
                this.companyUsers.push(user);
              })
          })
          observer.next();
          observer.complete();
        });
    });
  }

  fetchCompanySource(companyId: string, realmId: string){
    this.dataSource = this.http.post("http://localhost:3000/get_company_data",
      {
        "companyId": companyId,
        "realmId": realmId
      })
    return this.dataSource;

  }
}
