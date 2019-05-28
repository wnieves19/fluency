import { Component, OnInit } from '@angular/core';
import {LiquidityService} from '../liquidity.service';
import {Company} from '../../../company-management/models/company.model';
import {CompanyService} from '../../../company-management/company.service';

@Component({
  selector: 'app-liquidity-cashflow-charts',
  templateUrl: './liquidity-cashflow-charts.component.html',
  styleUrls: ['./liquidity-cashflow-charts.component.css']
})
export class LiquidityCashflowChartsComponent implements OnInit {
  series = new Array();
  categories = new Array();
  constructor(private liquidityService: LiquidityService, private companyService: CompanyService) { }

  ngOnInit() {
    let company: Company = this.companyService.getCompanyById(this.companyService.selectedCompany.companyId);
    var tbCount = 0;
    company.trialBalanceList.forEach(trialBalance => {
      if(tbCount>12)return;
      var waterfallAccounts = this.liquidityService.getWaterfallByPeriod(trialBalance.startPeriod);
      this.categories.splice(0, 0,this.liquidityService.getMonthFromPeriod(trialBalance.startPeriod))
      var cashBalance = this.liquidityService.getAccountBalanceByPeriod("Cash", trialBalance.startPeriod)
      if(waterfallAccounts===undefined){
        this.series.splice(0, 0,{startPeriod: trialBalance.startPeriod, cash: cashBalance, operatingCashFlow:0, freeCashFlow : 0, netCashFlow :0})
      }else {
        var operatingCashFlow = waterfallAccounts.filter(acct => {
          return acct.category === "Operating Cash Flow"
        });
        var freeCashFlow = waterfallAccounts.filter(acct => {
          return acct.category === "Free Cash Flow"
        });
        var netCashFlow = waterfallAccounts.filter(acct => {
          return acct.category === "Net Cash Flow"
        });
        this.series.splice(0, 0, {
          startPeriod: trialBalance.startPeriod,
          cash: cashBalance,
          operatingCashFlow: operatingCashFlow[0].balance,
          freeCashFlow: freeCashFlow[0].balance,
          netCashFlow: netCashFlow[0].balance
        })
      }
      tbCount++;
    })
  }

  public catContent = (e:any)=> {
    e.value
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
