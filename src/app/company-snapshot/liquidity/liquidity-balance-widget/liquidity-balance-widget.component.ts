import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material';
import {LiquidityBalanceDialogComponent} from './liquidity-balance-dialog/liquidity-balance-dialog.component';

@Component({
  selector: 'app-liquidity-balance-widget',
  templateUrl: './liquidity-balance-widget.component.html',
  styleUrls: ['./liquidity-balance-widget.component.css']
})
export class LiquidityBalanceWidgetComponent implements OnInit {

  constructor(private dialog: MatDialog) { }

  ngOnInit() {

  }
  public data: any[] =
    [165, 210, 287, 144, 190, 167, 212, 50, 240, 140, 205, 250];

  onCardClicked(widgetName){
    this.dialog.open(LiquidityBalanceDialogComponent, {
      width: '700px',
      data: {widgetName: widgetName}
    });
  }

}
