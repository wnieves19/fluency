import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material';
import {LiquidityBalanceDialogComponent} from './liquidity-balance-dialog/liquidity-balance-dialog.component';
import {CompanyService} from '../../../company-management/company.service';

@Component({
  selector: 'app-liquidity-balance-widget',
  templateUrl: './liquidity-balance-widget.component.html',
  styleUrls: ['./liquidity-balance-widget.component.css']
})
export class LiquidityBalanceWidgetComponent implements OnInit {

  constructor(private dialog: MatDialog, private companyService: CompanyService) { }

  ngOnInit() {

  }
  cashHistory = this.companyService.cashHistory;
  receivablesHistory = this.companyService.receivableHistory;
  payablesHistory = this.companyService.payableHistory;
  inventoryHistory = this.companyService.inventoryHistory;

  onCardClicked(widgetName, data){
    this.dialog.open(LiquidityBalanceDialogComponent, {
      width: '700px',
      data: {widgetName: widgetName, historyData: data}
    });
  }

}
