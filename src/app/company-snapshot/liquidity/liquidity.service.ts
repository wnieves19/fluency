import { Injectable } from '@angular/core';
import {CompanyService} from '../../company-management/company.service';
import {Observable} from 'rxjs';
import {TrialBalance} from '../../company-management/models/trial-balance.model';
import {AccountHistory} from '../AccountHistory';
import {Company} from '../../company-management/models/company.model';

@Injectable({
  providedIn: 'root'
})
export class LiquidityService {
  waterfallAccounts = new Array();
  accountsArray = [
    new AccountHistory("Cash", "subCategory", "widget", "add", "compound"),
    new AccountHistory("Revenue", "subCategory", "waterfall", "add" , "compound"),
    new AccountHistory("Cost of Sales", "category", "waterfall", "subtract" , "compound"),
    new AccountHistory("Expenses", "category", "waterfall", "subtract" , "compound"),
    new AccountHistory("Other Income", "type", "waterfall", "add" , "compound"),
    new AccountHistory("Global Tax Payable", "detailType", "waterfall", "subtract", "compound"),
    new AccountHistory("Accounts Payable", "subCategory","waterfall", "subtract", "change"),
    new AccountHistory("Other Current Liabilities", "detailType","waterfall", "subtract", "change"),
    new AccountHistory("Accounts Receivable", "subCategory", "waterfall", "subtract", "change"),
    new AccountHistory("Inventory", "detailType", "waterfall", "subtract", "change"),
    new AccountHistory("Other Current Assets", "subCategory", "waterfall", "add", "change"),
    new AccountHistory("Operating Cash Flow", "summary", "waterfall", "add", "compound"),
    new AccountHistory("Fixed Assets", "subCategory", "waterfall", "subtract", "change"),
    new AccountHistory("Intangible Assets", "subCategory", "waterfall", "subtract", "change"),
    new AccountHistory("Investments Other", "subCategory", "waterfall", "subtract", "change"),
    new AccountHistory("Free Cash Flow", "summary", "waterfall", "add", "compound"),
    new AccountHistory("Interest Expenses", "subCategory", "waterfall", "subtract", "compound"),
    new AccountHistory("Non-Current Liabilities", "category", "waterfall", "subtract", "change"),
    new AccountHistory("Dividend Disbursement", "category", "waterfall", "subtract", "compound"),
    new AccountHistory("Retained Earnings", "subCategory", "waterfall", "add", "change"),
    new AccountHistory("Equity", "subCategory", "waterfall", "subtract", "change"),
    new AccountHistory("Net Cash Flow", "summary", "waterfall", "add", "compound")
  ]

  constructor(private companyService: CompanyService) {
  }

  getWidgetData(companyId: string){
    this.emptyHistory();
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
    for(let account of this.accountsArray){
      if(account.accountName === accountName){
        return account.history;
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
    }
  }
  emptyHistory(){
    for (var i = 0; i < this.accountsArray.length; i++) {
      this.accountsArray[i].history = [];
    }
  }
  /** Gets data of each account of the waterfall chart for the specified period
   * period: index of month of the year 0 - 11 */
  getWaterfallByPeriod(period: string){
    var waterfall;
    waterfall = this.waterfallAccounts.filter(acct => {
      return acct.startPeriod === period
    });
    return waterfall[0].accounts;
  }
  /** Gets data of each account of the waterfall chart */
  getWaterfallAccounts(){
    let company: Company = this.companyService.getCompanyById(this.companyService.selectedCompany.companyId)
      return new Observable(observer => {
        company.trialBalanceList.forEach(trialBalance => {
          this.waterfallAccounts.push({
            startPeriod: trialBalance.startPeriod,
            accounts: this.getWaterfallAccountsForPeriod()
          })
        })
        observer.next();
        observer.complete();
      });

  }
  getWaterfallAccountsForPeriod() {
    var periodAccounts = new Array();
    for (let account of this.accountsArray) {
      if (account.component === "waterfall") {
        var balance = 0;

        var currentPeriodBalance = account.history[account.history.length - 1].balance
        var previousPeriodBalance = account.history[account.history.length -2].balance

        if (account.categoryType === "change") {
          balance = currentPeriodBalance - previousPeriodBalance;
        } else {
          balance = currentPeriodBalance;
        }

        if (account.action === "subtract" && account.categoryType === "compound") {
          balance = -balance;
        }
        if (account.property === "summary") {
          periodAccounts.push({category: account.accountName, summary: "runningTotal"})
        } else {
          periodAccounts.push({category: account.accountName, balance: balance})
        }
      }
    }
    return periodAccounts
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
