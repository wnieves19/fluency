import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-liquidity-balance-dialog',
  templateUrl: './liquidity-balance-dialog.component.html',
  styleUrls: ['./liquidity-balance-dialog.component.css']
})
export class LiquidityBalanceDialogComponent implements OnInit {
  widgetName = "";
  historyArray = ""

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<LiquidityBalanceDialogComponent>) { }

  ngOnInit() {
    this.widgetName = this.data.widgetName;
    this.historyArray = this.data.historyData
  }

  okClicked(){
    this.dialogRef.close();
  }


}
