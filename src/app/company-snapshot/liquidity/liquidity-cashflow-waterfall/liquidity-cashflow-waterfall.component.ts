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
    data: [1.4, -.78, -.47, .6]
  }];
  public categories: string[] = ["Revenue", "COGS", "Expenses", "Other Income", "Cash Tax Paid", "Change in Accounts Payable",
    "Change in Current Liabilities", "Change in Accounts Receivable", "Change in Inventory", "Change in Work in Progress",
    "Change in Other Current Assets","Change in Fixed Assets (ex. Depn and Amort)",
    "Change in Intangible Assets", "Change in Investment or Other Non-Current Assets", "Net Interest (after tax)",
    "Change in Other Non-Current Liabilities", "Dividends", "Change in Retained Earnings and Other Equity", "Adjustments" ];

  public pointColor(point: any): string {
    if (point.value > 0) {
      return '#78D237';
    } else {
      return '#FF7C73';
    }
  }

}
