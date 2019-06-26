import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {MAT_DIALOG_DATA} from '@angular/material';
import {Constants} from '../../../../constants';

@Component({
  selector: 'app-liquidity-balance-dialog',
  templateUrl: './liquidity-balance-dialog.component.html',
  styleUrls: ['./liquidity-balance-dialog.component.css']
})
export class LiquidityBalanceDialogComponent implements OnInit {
  widgetName;
  historyArray;
  widgetDescription;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private constants: Constants,
              public dialogRef: MatDialogRef<LiquidityBalanceDialogComponent>) { }

  ngOnInit() {
    this.widgetName = this.data.widgetName;
    this.historyArray = this.data.historyData

    switch(this.widgetName){
      case "Cash Balance":{
        this.widgetDescription = this.constants.CASH_DESCRIPTION;
        break;
      }
      case "Accounts Receivable":{
        this.widgetDescription = this.constants.RECEIVABLE_DESCRIPTION;
        break;
      }
      case "Accounts Payable":{
        this.widgetDescription = this.constants.PAYABLE_DESCRIPTION;
        break;
      }
      case "Inventory":{
        this.widgetDescription = this.constants.INVENTORY_DESCRIPTION;
        break;
      }
    }
  }

  public labelContent = (e: any) => {
    if(e.value < 1000) return "$"+e.value
    if (e.value >999 && e.value < 1000000){
      return  "$"+ e.value/1000 + "K"
    }else if(e.value > 999999 && e.value < 1000000000){
      return  "$"+ e.value/1000 + "M"
    }
  }

  okClicked(){
    this.dialogRef.close();
  }


}
