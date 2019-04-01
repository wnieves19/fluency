import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material';
import {LiquidityBalanceDialogComponent} from './liquidity-balance-dialog/liquidity-balance-dialog.component';
import {LiquidityService} from '../liquidity.service';
import {CompanyService} from '../../../company-management/company.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-liquidity-balance-widget',
  templateUrl: './liquidity-balance-widget.component.html',
  styleUrls: ['./liquidity-balance-widget.component.css']
})
export class LiquidityBalanceWidgetComponent implements OnInit, OnDestroy {
  cashHistory;
  receivablesHistory;
  payablesHistory;
  inventoryHistory;

  cashArray=[];
  receivablesArray=[];
  payablesArray=[];
  inventoryArray=[];

  subscriptions: Subscription[]=[];

  constructor(private dialog: MatDialog,private companyService: CompanyService, private liquidityService: LiquidityService) { }

  ngOnInit() {
    this.clearArrays();
    var subscription = this.liquidityService.getWidgetData(this.companyService.selectedCompany.companyId)
      .subscribe(()=>{
        this.cashHistory = this.liquidityService.getAccountHistory("Cash");
        this.receivablesHistory = this.liquidityService.getAccountHistory("Accounts Receivable");
        this.payablesHistory = this.liquidityService.getAccountHistory("Accounts Payable");
        this.inventoryHistory = this.liquidityService.getAccountHistory("Inventory");
        this.initArrays();
      })
    this.subscriptions.push(subscription);
  }

  initArrays(){
    for (var i=0; i<this.cashHistory.length; i++){
      this.cashArray.push(this.cashHistory[i].balance);
    }
    for(var i=0; i<this.receivablesHistory.length; i++){
      this.receivablesArray.push(this.receivablesHistory[i].balance);
    }
    for (var i=0; i< this.payablesHistory.length; i++){
      this.payablesArray.push(this.payablesHistory[i].balance);
    }
    for(let obj of this.inventoryHistory){
      this.inventoryArray.push(obj.balance)
    }
  }
  onCardClicked(widgetName, data){
    this.dialog.open(LiquidityBalanceDialogComponent, {
      width: '700px',
      data: {widgetName: widgetName, historyData: data}
    });
  }

  clearArrays(){
    this.cashArray=[];
    this.receivablesArray=[];
    this.payablesArray=[];
    this.inventoryArray=[];

    this.cashHistory=[];
    this.receivablesHistory=[];
    this.payablesHistory=[];
    this.inventoryHistory=[];

  }

  ngOnDestroy(): void {
    for (let subscription of this.subscriptions){
      if(subscription)
        subscription.unsubscribe()
    }
  }

}
