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
    new AccountHistory("Revenue", "category", "waterfall", "add" , "currentToPrevious"),
    new AccountHistory("Cost of Sales", "category", "waterfall", "subtract" , "currentToPrevious"),
    new AccountHistory("Expenses", "category", "waterfall", "subtract" , "currentToPrevious"),
    new AccountHistory("Net Income", "total", "waterfall", "add", "compound"),
    new AccountHistory("Depreciation", "detailType", "waterfall", "add", "currentToPrevious"),
    new AccountHistory("Accounts Payable", "subCategory","waterfall", "subtract", "currentToPrevious"),
    new AccountHistory("Current Liabilities", "category","waterfall", "subtract", "currentToPrevious"),
    new AccountHistory("Accounts Receivable", "subCategory", "waterfall", "subtract", "previousToCurrent"),
    new AccountHistory("Inventory", "detailType", "waterfall", "subtract", "previousToCurrent"),
    new AccountHistory("Other Current Assets", "subCategory", "waterfall", "add", "previousToCurrent"),
    new AccountHistory("Operating Cash Flow", "total", "waterfall", "add", "compound"),
    new AccountHistory("Fixed Assets", "subCategory", "waterfall", "subtract", "previousToCurrent"),
    new AccountHistory("Intangible Assets", "subCategory", "waterfall", "subtract", "previousToCurrent"),
    new AccountHistory("Investments Other", "subCategory", "waterfall", "subtract", "previousToCurrent"),
    new AccountHistory("Free Cash Flow", "total", "waterfall", "add", "compound"),
    new AccountHistory("Interest Expenses", "subCategory", "waterfall", "subtract", "compound"),
    new AccountHistory("Non-Current Liabilities", "category", "waterfall", "subtract", "currentToPrevious"),
    new AccountHistory("Dividend Disbursement", "category", "waterfall", "subtract", "currentToPrevious"),
    new AccountHistory("Retained Earnings", "subCategory", "waterfall", "add", "currentToPrevious"),
    new AccountHistory("Equity", "category", "waterfall", "subtract", "currentToPrevious"),
    new AccountHistory("Net Cash Flow", "total", "waterfall", "add", "compound")
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
    var accountHistoryArray = new Array();
    for(let account of this.accountsArray){
      if(account.accountName === accountName){
        for(var i = account.history.length; i > 1 ; i--){
          accountHistoryArray.splice(0,0,account.history[i-1]);
        }
      }
    }
    return accountHistoryArray;
  }

  insertAccountSummary(trialBalance: TrialBalance){

    for(var i=0; i<this.accountsArray.length; i++){

      var account
      var balance = 0
      if (this.accountsArray[i].property === "subCategory") {
        account = trialBalance.accounts.filter(acct => {
          return acct.subCategory === this.accountsArray[i].accountName;
        });
      }
      if (this.accountsArray[i].property === "category") {
        account = trialBalance.accounts.filter(acct => {
          return acct.category === this.accountsArray[i].accountName;
        });
      }
      if (this.accountsArray[i].property === "detailType") {
        account = trialBalance.accounts.filter(acct => {
          return acct.detailType === this.accountsArray[i].accountName;
        });
      }
      if (this.accountsArray[i].property === "type") {
        account = trialBalance.accounts.filter(acct => {
          return acct.type === this.accountsArray[i].accountName;
        });
      }

      if(this.accountsArray[i].property!=="runningTotal") {
        balance = this.getBalanceTotal(account)
      }
      this.accountsArray[i].history.splice(0, 0,
        {
          startPeriod: trialBalance.startPeriod,
          periodName: this.getMonthFromPeriod(trialBalance.startPeriod),
          balance: balance
        }
      );

    }
  }
  emptyHistory(){
    for (var i = 0; i < this.accountsArray.length; i++) {
      this.accountsArray[i].history = [];
    }
  }
  emptyWaterfallAccounts(){
    this.waterfallAccounts = [];

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
  /** Returns the balance of an account in a specified period*/
  getAccountBalanceByPeriod(accountName: string, period: string){
    var history = this.getAccountHistory(accountName)
    var per = history.filter(history =>{
      return history.startPeriod === period;
    })
    return per[0].balance
  }
  /** Gets data of each account of the waterfall chart */
  initWaterfallAccounts(){
    this.emptyWaterfallAccounts();
    let company: Company = this.companyService.getCompanyById(this.companyService.selectedCompany.companyId)
    return new Observable(observer => {
      company.trialBalanceList.forEach(trialBalance => {
        this.waterfallAccounts.push({
          startPeriod: trialBalance.startPeriod,
          accounts: this.getWaterfallAccountsForPeriod(trialBalance.startPeriod)
        })
      })
      observer.next();
      observer.complete();
    });
  }

  getPreviousPeriod(period: string){
    var dateArray = period.split("-");
    var date = new Date(parseInt(dateArray[0]), parseInt(dateArray[1])-1, parseInt(dateArray[2]));
    // var date = new Date(period);
    var month = date.getMonth();
    var year = date.getFullYear()
    if(month === 0){
      month = 12;
      year --;
    }
    var p = year +"-" + ("0" + month).slice(-2) +"-01";
    return p;
  }
  getWaterfallAccountsForPeriod(period: string) {
    var periodAccounts = new Array();
    var summaryBalance = 0;
    var depreciationValue= 0;
    //For each account in the account array
    for (let account of this.accountsArray) {
      //If it's part of the waterfall, then proceed (we're calculating the waterfall here only)
      if (account.component === "waterfall") {
        //If it's a total account, insert the current balance
        if(account.property === "total"){
          periodAccounts.push({category: account.accountName, summary: account.property, balance : summaryBalance})
        }else{//Otherwise
          var balance = 0;
          //Get the waterfall account for the current period
          var currentPeriodAcct = account.history.filter(acct => {
            return acct.startPeriod === period;
          });
          //Get the waterfall account for the previous period
          var prevPeriodAcct = account.history.filter(acct => {
            return acct.startPeriod === this.getPreviousPeriod(period);
          });
          //Get the balance of the account for the current period
          var currentPeriodBalance = currentPeriodAcct[0].balance;
          if(prevPeriodAcct[0]===undefined)return;
          var previousPeriodBalance = 0;
          //If the previous period marks the end of a period (e.g. December)
          if(this.isEndOfPeriod(prevPeriodAcct[0].startPeriod )){
            if(account.accountName==="Revenue" || account.accountName==="Cost of Sales" ||
              account.accountName==="Expenses" || account.accountName==="Depreciation" ) {
              previousPeriodBalance = 0
            }else{
              previousPeriodBalance = prevPeriodAcct[0].balance
            }
          }else{
            //If it's not an end of period, just get the balance
            previousPeriodBalance = prevPeriodAcct[0].balance
          }
          //If the balance is calculated substracting current - previous balance
          if (account.categoryType === "currentToPrevious") {
            if(previousPeriodBalance>0) {
              balance = currentPeriodBalance - previousPeriodBalance;
            }else{
              balance = currentPeriodBalance + previousPeriodBalance;
            }
          } else if(account.categoryType ==="previousToCurrent"){
            //Else if the balance is calculated substracting current - previous balance
            if(currentPeriodBalance>0) {
              balance = previousPeriodBalance - currentPeriodBalance;
            }else{
              balance = previousPeriodBalance + currentPeriodBalance;
            }
          }else {
            //Otherwise just return the balance
            balance = currentPeriodBalance;
          }

          if (account.action === "subtract"  ) {
            if(account.accountName==="Revenue" || account.accountName==="Cost of Sales" ||
              account.accountName==="Expenses" || account.accountName==="Depreciation" ) {
              balance = -balance
            }
          }

          if(account.accountName==="Depreciation"){
            depreciationValue = balance;
          }else if(account.accountName==="Fixed Assets"){
            balance = balance + depreciationValue;
            depreciationValue=0;
          }
          summaryBalance = summaryBalance + balance;
          periodAccounts.push({category: account.accountName, balance: balance})
        }
      }
    }
    return periodAccounts
  }

  isEndOfPeriod(period){
    if(this.getMonthFromPeriod(period)==="Dec")return true;
    return false;
  }

  getMonthFromPeriod(dateString: string){
    var dateArray = dateString.split("-");
    var date = new Date(parseInt(dateArray[0]), parseInt(dateArray[1])-1, parseInt(dateArray[2]));
    const month = date.toLocaleString('en-us', { month: 'short' });
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
