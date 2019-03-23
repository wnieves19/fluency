import { Injectable } from '@angular/core';
import {Company} from './models/company.model';
import {AngularFireDatabase} from '@angular/fire/database';
import {AuthService} from '../user-authentication/auth.service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {TrialBalance} from './models/trial-balance.model';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  companies = new Array();
  //TODO: Replace with query parameter
  selectedCompany: Company;
  dataSource: Observable<any>
  companiesObservable: Observable<any>;
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

  fetchTrailBalances(companyId: string){
    var tbProcessed = 0;
    this.db.list<TrialBalance>('company-data/'+companyId).valueChanges()
      .subscribe(
        (trialBalanceArray) => {
          trialBalanceArray.forEach(trialBalance => {
            this.getCompanyById(companyId).trialBalance.push(trialBalance);
            tbProcessed ++;
            if(tbProcessed === trialBalanceArray.length){
              this.calculateCharts(companyId);
            }
          });
        }
      )}

  calculateCharts(companyId: string){
    let company = this.getCompanyById(companyId)
    let trialBalance = company.trialBalance.filter(trialBalance =>{
      return trialBalance.startPeriod === "2019-03-01";
    });
    var cashAccounts = trialBalance[0].accounts.filter(account =>{
      return account.subCategory === "Cash";
    });
    var cashBalance = this.getBalanceTotal(cashAccounts);

    var receivables = trialBalance[0].accounts.filter(account =>{
      return account.subCategory === "Accounts Receivable";
    });
    var receivableBalance = this.getBalanceTotal(receivables);

    var payables = trialBalance[0].accounts.filter(account => {
      return account.subCategory === "Accounts Payable";
    });
    var payableBalance = this.getBalanceTotal(payables);

    var inventory = trialBalance[0].accounts.filter(account => {
      return account.detailType === "Inventory";
    });
    var inventoryBalance = this.getBalanceTotal(inventory);
  }

  getBalanceTotal(accountsArray){
    var total = 0
    accountsArray.forEach(account =>{
      total = total + Number(account.balance);
    })
    return total;
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
