import { Component, OnInit } from '@angular/core';
import {LiquidityService} from '../liquidity.service';
import {CategoryAxisLabels} from '@progress/kendo-angular-charts';

@Component({
  selector: 'app-liquidity-cashflow-waterfall',
  templateUrl: './liquidity-cashflow-waterfall.component.html',
  styleUrls: ['./liquidity-cashflow-waterfall.component.css']
})
export class LiquidityCashflowWaterfallComponent implements OnInit {
  months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  series;
  periods = new Array()
  selectedPeriod;

  constructor(private liquidityService: LiquidityService) { }

  ngOnInit() {
    this.initPeriods()
    this.liquidityService.initWaterfallAccounts()
      .subscribe(()=>{
        this.series = this.liquidityService.getWaterfallByPeriod(this.selectedPeriod)
      });
  }

  periodSelected(){
    this.series = this.liquidityService.getWaterfallByPeriod(this.selectedPeriod)
  }

  initPeriods(){
    var date = new Date();
    var month = date.getMonth() + 1;
    var year = date.getFullYear()
    for (var i = month; i !== month+1; i--) {
      if (i == 0) {
        i = 12;
        year--;
      }
      this.periods.push({value: year +"-" + ("0" + i).slice(-2) +"-01", name: this.months[i-1]})
    }
    this.selectedPeriod = this.periods[0].value;
  }
  public labelContent = (e: any) => {
    if(e.value>-1000 && e.value < 1000) return "$"+e.value
    if (e.value >999 && e.value < 1000000 ||  e.value > -1000000 && e.value <-999){
      return  "$"+ e.value/1000 + "K"
    }else if(e.value > 999999 && e.value < 1000000000 || e.value > -1000000000 && e.value < -999999 ){
      return  "$"+ e.value/1000 + "M"
    }
  }
  public categories: string[] = ["Revenue", "COGS", "Expenses",
    // "Other Income", "Cash Tax Paid",
    "NET INCOME",
    "Depreciation",
    "Change in Accounts Payable",
    "Change in Current Liabilities", "Change in Accounts Receivable", "Change in Inventory",
    "Change in Other Current Assets","OPERATING CASH FLOW", "Change in Fixed Assets",
    "Change in Intangible Assets", "Change in Investment", "FREE CASH FLOW", "Net Interest (after tax)",
    "Change in Other Non-Current Liabilities", "Dividends", "Change in Retained Earnings and Other Equity", "Adjustments", "NET CASH FLOW" ];

  public pointColor(point: any): string {
    var summary = point.dataItem.summary;
    if (summary) {
      return '#BDBDBD';
    }
    if (point.value > 0) {
      return '#54B701';
    } else {
      // return '#D10C21';
      return '#FF9800';
    }
  }
  public catLabels: CategoryAxisLabels = {
    position: "start"
  };

  public seriesLabels(point: any) {
    var summary = point.dataItem.summary;
    var category = point.dataItem.category;

    if (summary) {
      return {
        visible: true,
        padding: {right:10},
        position:"insideBase",
        font: 'bold 20px Arial, sans-serif',
        format: "{0:c}"
      };
    }
    if (category) {
      return {
        visible: true, // Note that visible defaults to false
        padding: {right:10},
        font: '12px Arial, sans-serif',
        position: 'insideBase',
        format: "{0:c}"
      };
    }


  }

}
