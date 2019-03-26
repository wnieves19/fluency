import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material';
import {LiquidityBalanceDialogComponent} from './liquidity-balance-dialog/liquidity-balance-dialog.component';
import {LiquidityService} from '../liquidity.service';
import {CompanyService} from '../../../company-management/company.service';

@Component({
  selector: 'app-liquidity-balance-widget',
  templateUrl: './liquidity-balance-widget.component.html',
  styleUrls: ['./liquidity-balance-widget.component.css']
})
export class LiquidityBalanceWidgetComponent implements OnInit {
  cashHistory;
  receivablesHistory;
  payablesHistory;
  inventoryHistory;
  constructor(private dialog: MatDialog,private companyService: CompanyService, private liquidityService: LiquidityService) { }

  ngOnInit() {
    this.liquidityService.getWidgetData(this.companyService.selectedCompany.companyId)
      .subscribe(()=>{
        this.cashHistory = this.liquidityService.cashHistory;
        this.receivablesHistory = this.liquidityService.receivableHistory;
        this.payablesHistory = this.liquidityService.payableHistory;
        this.inventoryHistory = this.liquidityService.inventoryHistory;
      })
  }

  onCardClicked(widgetName, data){
    this.dialog.open(LiquidityBalanceDialogComponent, {
      width: '700px',
      data: {widgetName: widgetName, historyData: data}
    });
  }

}
