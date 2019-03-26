import { Injectable } from '@angular/core';
import {CompanyService} from '../../company-management/company.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LiquidityService {
  cashHistory=[]
  receivableHistory=[]
  payableHistory=[]
  inventoryHistory=[]

  constructor(private companyService: CompanyService) { }

  getWidgetData(companyId: string){
    this.clearCompanyData();
    let company = this.companyService.getCompanyById(companyId)
    return new Observable((observer) => {
      company.trialBalanceList.forEach(trialBalance => {
        var cashAccounts = trialBalance.accounts.filter(account => {
          return account.subCategory === "Cash";
        });
        this.cashHistory.splice(0, 0,this.getBalanceTotal(cashAccounts));

        var receivables = trialBalance.accounts.filter(account => {
          return account.subCategory === "Accounts Receivable";
        });
        this.receivableHistory.splice(0, 0,this.getBalanceTotal(receivables));

        var payables = trialBalance.accounts.filter(account => {
          return account.subCategory === "Accounts Payable";
        });
        this.payableHistory.splice(0, 0,this.getBalanceTotal(payables));

        var inventory = trialBalance.accounts.filter(account => {
          return account.detailType === "Inventory";
        });
        this.inventoryHistory.splice(0, 0,this.getBalanceTotal(inventory));
      });
      observer.next()
      observer.complete();
    })
  }

  clearCompanyData(){
    this.cashHistory = [];
    this.receivableHistory=[];
    this.payableHistory=[];
    this.inventoryHistory=[];
  }

  getBalanceTotal(accountsArray){
    var total = 0
    accountsArray.forEach(account =>{
      total = total + Number(account.balance);
    })
    return total;
  }
}
