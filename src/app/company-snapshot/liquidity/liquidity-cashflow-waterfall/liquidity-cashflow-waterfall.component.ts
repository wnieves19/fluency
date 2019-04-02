import { Component, OnInit } from '@angular/core';
import {LiquidityService} from '../liquidity.service';

@Component({
  selector: 'app-liquidity-cashflow-waterfall',
  templateUrl: './liquidity-cashflow-waterfall.component.html',
  styleUrls: ['./liquidity-cashflow-waterfall.component.css']
})
export class LiquidityCashflowWaterfallComponent implements OnInit {
  series;
  constructor(private liquidityService: LiquidityService) { }

  ngOnInit() {
    this.series = this.liquidityService.getWaterfallAccounts()
  }
  public categories: string[] = ["Revenue", "COGS", "Expenses", "Other Income", "Cash Tax Paid", "Change in Accounts Payable",
    "Change in Current Liabilities", "Change in Accounts Receivable", "Change in Inventory",
    "Change in Other Current Assets","Operating Cash Flow", "Change in Fixed Assets",
    "Change in Intangible Assets", "Change in Investment", "Free Cash Flow", "Net Interest (after tax)",
    "Change in Other Non-Current Liabilities", "Dividends", "Change in Retained Earnings and Other Equity", "Adjustments", "Net Cash Flow" ];

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

}
