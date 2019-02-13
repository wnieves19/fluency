import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-liquidity-cashflow-waterfall',
  templateUrl: './liquidity-cashflow-waterfall.component.html',
  styleUrls: ['./liquidity-cashflow-waterfall.component.css']
})
export class LiquidityCashflowWaterfallComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  public series: any[] = [{
    name: "Cash Flow",
    data: [1.4, -.78, -.47, .6],
    color: ["#4CAF50", "#FF5252","#FF5252", "#4CAF50" ]
  }];
  public categories: string[] = ["Revenue", "COGS", "Expenses", "Other Income", "Cash Tax Paid", "Change in Accounts Payable",
    "Change in Current Liabilities", "Change in Accounts Receivable", "Change in Inventory", "Change in Work in Progress", "Change in Other Current Assets"];

  public pointColor(point: any): string {
    if (point.value > 0) {
      return '#4CAF50';
    } else {
      return '#FF5252';
    }
  }

}
