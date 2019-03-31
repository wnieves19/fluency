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
    new AccountHistory("Cash"),
    new AccountHistory("Accounts Receivable"),
    new AccountHistory("Accounts Payable"),
    new AccountHistory("Revenue"),
    new AccountHistory("Cost of Sales"),
    new AccountHistory("Expenses"),
    new AccountHistory("Other Income")]

  constructor(private companyService: CompanyService) { }

  getWidgetData(companyId: string){
    let company = this.companyService.getCompanyById(companyId)
    return new Observable((observer) => {
      company.trialBalanceList.forEach(trialBalance => {
        this.insertAccountSummary(trialBalance);

        // var inventory = trialBalance.accounts.filter(account => {
        //   return account.detailType === "Inventory";
        // });
        // this.inventoryHistory.splice(0, 0,
        //   {
        //     startPeriod: this.getMonthFromPeriod(trialBalance.startPeriod),
        //     balance: this.getBalanceTotal(inventory)
        //   }
        // );
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
      var account = trialBalance.accounts.filter(account => {
        return account.subCategory === this.accountsArray[i].accountName;
      });
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
