import { Component, OnInit } from '@angular/core';
import {LiquidityService} from '../liquidity.service';
import {Company} from '../../../company-management/models/company.model';
import {CompanyService} from '../../../company-management/company.service';
import {TrialBalance} from '../../../company-management/models/trial-balance.model';

@Component({
  selector: 'app-liquidity-cashflow-charts',
  templateUrl: './liquidity-cashflow-charts.component.html',
  styleUrls: ['./liquidity-cashflow-charts.component.css']
})
export class LiquidityCashflowChartsComponent implements OnInit {
  cashFlowSeries = new Array();
  cashFlowCategories = new Array();
  receiptsDisbursementSeries = new Array();
  constructor(private liquidityService: LiquidityService, private companyService: CompanyService) { }

  ngOnInit() {
    let company: Company = this.companyService.getCompanyById(this.companyService.selectedCompany.companyId);
    var tbCount = 0;
    company.trialBalanceList.forEach(trialBalance => {
      if(tbCount>12)return;
      var currentPeriodAccounts = this.liquidityService.getWaterfallByPeriod(trialBalance.startPeriod);
      this.cashFlowCategories.splice(0, 0,this.liquidityService.getMonthFromPeriod(trialBalance.startPeriod));
      this.getCashflowBalances(trialBalance, currentPeriodAccounts);
      this.getCashReceipts(company.trialBalanceList, trialBalance.startPeriod);
      tbCount++;
    })
  }

  getCashflowBalances(trialBalance, currentPeriodAccounts) {
    var cashBalance = this.liquidityService.getAccountBalanceByPeriod('Cash', trialBalance.startPeriod);
    if (currentPeriodAccounts === undefined) {
      this.cashFlowSeries.splice(0, 0, {
        startPeriod: trialBalance.startPeriod,
        cash: cashBalance,
        operatingCashFlow: 0,
        freeCashFlow: 0,
        netCashFlow: 0
      });
    } else {
      var operatingCashFlow = currentPeriodAccounts.filter(acct => {
        return acct.category === 'Operating Cash Flow';
      });
      var freeCashFlow = currentPeriodAccounts.filter(acct => {
        return acct.category === 'Free Cash Flow';
      });
      var netCashFlow = currentPeriodAccounts.filter(acct => {
        return acct.category === 'Net Cash Flow';
      });
      this.cashFlowSeries.splice(0, 0, {
        startPeriod: trialBalance.startPeriod,
        cash: cashBalance,
        operatingCashFlow: operatingCashFlow[0].balance,
        freeCashFlow: freeCashFlow[0].balance,
        netCashFlow: netCashFlow[0].balance
      });
    }
  }

  getCashReceipts(trialBalanceList: TrialBalance[], period){
    var currentPeriodTb = trialBalanceList.filter(tb => {
      return tb.startPeriod === period;
    })
    var previousPeriodTb = trialBalanceList.filter(tb => {
      return tb.startPeriod === this.liquidityService.getPreviousPeriod(period);
    })

    if(previousPeriodTb[0]===undefined){
      this.receiptsDisbursementSeries.splice(0, 0, {
        startPeriod: 0 ,
        receipts: 0,
      });
    }

    var currentRevenues = 0;
    var previousRevenues = 0;
    var currentReceivables = 0;
    var previousReceivables = 0;
    var revenues = 0;
      currentPeriodTb[0].accounts.forEach(account=>{
      if(account.category ==="Revenue"){
        currentRevenues = currentRevenues + Number(account.balance);
      }

      if(account.subCategory ==="Accounts Receivable"){
        currentReceivables = currentReceivables +  Number(account.balance);
      }
    })
    previousPeriodTb[0].accounts.forEach(account=>{
      if(account.subCategory ==="Accounts Receivable"){
        previousReceivables = previousReceivables +  Number(account.balance);
      }
      if(account.category ==="Revenue"){
        previousRevenues = previousRevenues + Number(account.balance);
      }
    })
    revenues = currentRevenues - previousRevenues;
    var receiptsBalance = revenues + (currentReceivables - previousReceivables);
    this.receiptsDisbursementSeries.splice(0, 0, {
      startPeriod: period ,
      receipts: receiptsBalance,
    });

  }

  public labelContent = (e: any) => {
    if(e.value < 1000) return "$"+e.value
    if (e.value >999 && e.value < 1000000){
      return  "$"+ e.value/1000 + "K"
    }else if(e.value > 999999 && e.value < 1000000000){
      return  "$"+ e.value/1000 + "M"
    }
  }

}
