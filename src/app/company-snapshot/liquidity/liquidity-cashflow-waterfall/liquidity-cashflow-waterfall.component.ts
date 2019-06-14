import { Component, OnInit } from '@angular/core';
import {LiquidityService} from '../liquidity.service';

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
    var i = 3
    while (i != 0){
      this.periods.push({value:date.getFullYear() +"-" + ("0" + month).slice(-2) +"-01", name: this.months[month-1]})
      i--
      month --;
    }
    this.selectedPeriod = this.periods[0].value;
  }
  public labelContent = (e: any) => {
    if(e.value < 1000) return "$"+e.value
    if (e.value >999 && e.value < 1000000){
      return  "$"+ e.value/1000 + "K"
    }else if(e.value > 999999 && e.value < 1000000000){
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
      return summary == 'total' ? '#555' : 'gray';
    }
    if (point.value > 0) {
      return '#54B701';
    } else {
      return '#D10C21';
    }
  }
  public seriesLabels(point: any) {
    var summary = point.dataItem.summary;
    var category = point.dataItem.category;

    if (summary) {
      return {
        visible: true, // Note that visible defaults to false
        padding: 3,
        font: 'bold 20px Arial, sans-serif',
        format: "{0:c}"
      };
    }
    if (category) {
      return {
        visible: true, // Note that visible defaults to false
        padding: 3,
        font: '12px Arial, sans-serif',
        position: 'insideEnd',
        format: "{0:c}"
      };
    }


  }

}
