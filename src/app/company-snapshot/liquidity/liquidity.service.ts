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
        this.cashHistory.splice(0, 0,
          {
            startPeriod: this.getMonthFromPeriod(trialBalance.startPeriod),
            balance: this.getBalanceTotal(cashAccounts)
          }
        );
        var receivables = trialBalance.accounts.filter(account => {
          return account.subCategory === "Accounts Receivable";
        });
        this.receivableHistory.splice(0, 0,
          {
            startPeriod: this.getMonthFromPeriod(trialBalance.startPeriod),
            balance: this.getBalanceTotal(receivables)
          }
        );
        var payables = trialBalance.accounts.filter(account => {
          return account.subCategory === "Accounts Payable";
        });
        this.payableHistory.splice(0, 0,
          {
            startPeriod: this.getMonthFromPeriod(trialBalance.startPeriod),
            balance: this.getBalanceTotal(payables)
          }
        );
        var inventory = trialBalance.accounts.filter(account => {
          return account.detailType === "Inventory";
        });
        this.inventoryHistory.splice(0, 0,
          {
            startPeriod: this.getMonthFromPeriod(trialBalance.startPeriod),
            balance: this.getBalanceTotal(inventory)
          }
        );
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

  getMonthFromPeriod(dateString: string){
    var dateArray = dateString.split("-");
    var date = new Date(parseInt(dateArray[0]), parseInt(dateArray[1]-1), parseInt(dateArray[2]));
    const month = date.toLocaleString('en-us', { month: 'long' });
    return month;
  }

  getBalanceTotal(accountsArray){
    var total = 0
    accountsArray.forEach(account =>{
      total = total + Number(account.balance);
    })
    return total;
  }
}
