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

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<LiquidityBalanceDialogComponent>) { }

  ngOnInit() {
    this.widgetName = this.data.widgetName;
  }

  okClicked(){
    this.dialogRef.close();
  }


}
