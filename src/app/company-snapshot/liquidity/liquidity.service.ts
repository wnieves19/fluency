import { Injectable } from '@angular/core';
import {CompanyService} from '../../company-management/company.service';
import {Observable} from 'rxjs';
import {TrialBalance} from '../../company-management/models/trial-balance.model';
import {AccountHistory} from '../AccountHistory';

@Injectable({
  providedIn: 'root'
})
export class LiquidityService {
  accountsArray = [
    new AccountHistory("Cash", "subCategory"),
    new AccountHistory("Accounts Receivable", "subCategory"),
    new AccountHistory("Accounts Payable", "subCategory"),
    new AccountHistory("Inventory", "detailType"),
    new AccountHistory("Revenue", "subCategory"),
    new AccountHistory("Cost of Sales", "category"),
    new AccountHistory("Expenses", "category"),
    new AccountHistory("Other Income", "type")]

  constructor(private companyService: CompanyService) { }

  getWidgetData(companyId: string){
    let company = this.companyService.getCompanyById(companyId)
    return new Observable((observer) => {
      company.trialBalanceList.forEach(trialBalance => {
        this.insertAccountSummary(trialBalance);
      });
      observer.next()
      observer.complete();
    })
  }

  getAccountHistory (accountName: string){
    for(let history of this.accountsArray){
      if(history.accountName === accountName){
        return history.history;
      }
    }
  }

  insertAccountSummary(trialBalance: TrialBalance){
    for(var i=0; i<this.accountsArray.length; i++){
      var account
      if(this.accountsArray[i].property==="subCategory") {
        account = trialBalance.accounts.filter(acct => {
          return acct.subCategory === this.accountsArray[i].accountName;
        });
      }
      if(this.accountsArray[i].property==="category") {
        account = trialBalance.accounts.filter(acct => {
          return acct.category === this.accountsArray[i].accountName;
        });
      }
      if(this.accountsArray[i].property==="detailType") {
        account = trialBalance.accounts.filter(acct => {
          return acct.detailType === this.accountsArray[i].accountName;
        });
      }
      if(this.accountsArray[i].property==="type") {
        account = trialBalance.accounts.filter(acct => {
          return acct.type === this.accountsArray[i].accountName;
        });
      }
        this.accountsArray[i].history.splice(0, 0,
          {
            startPeriod: this.getMonthFromPeriod(trialBalance.startPeriod),
            balance: this.getBalanceTotal(account)
          }
        );

      console.log(this.accountsArray[i])
    }
  }

  getMonthFromPeriod(dateString: string){
    var dateArray = dateString.split("-");
    var date = new Date(parseInt(dateArray[0]), parseInt(dateArray[1])-1, parseInt(dateArray[2]));
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
