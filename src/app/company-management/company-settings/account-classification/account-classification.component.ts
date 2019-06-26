import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSnackBar, MatTabChangeEvent, MatTableDataSource} from '@angular/material';
import {AccountModel} from '../../models/account.model';
import {CompanyService} from '../../company.service';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-account-classification',
  templateUrl: './account-classification.component.html',
  styleUrls: ['./account-classification.component.css']
})
export class AccountClassificationComponent implements OnInit {
  displayedColumns: string[] = ['name', 'category', 'subcategory'];
  subcategories: string[] = ['Cash', 'Accounts Receivable', 'Other Current Assets', 'Intangible Assets', 'Fixed Assets',
    'Other Assets', 'Accounts Payable', 'Short Term Debt', 'Tax Liability','Other Current Liabilities', 'Long Term Liability',
    'Equity', 'Retained Earnings', 'Revenue', 'Dividend Income', 'Interest Earnings', 'Fixed COS', 'Variable COS', 'Fixed Expenses',
    'Interest Expense', 'Variable Expenses', 'Taxes Paid', 'Expenses'];

  subcategoryControls = new Array()
  filteredOptions = new Array();
  dataSource = new MatTableDataSource<AccountModel>(this.getPLAccounts(this.companyService.selectedCompany.companyAccounts));
  tabSelected = 0;
  @ViewChild('pl', {static: true}) paginator: MatPaginator;
  @ViewChild('balance', {static: true}) balancePaginator: MatPaginator;

  constructor(private snackBar: MatSnackBar, private companyService: CompanyService) { }

  ngOnInit() {
    this.initPagination(this.tabSelected);
  }
  private initPagination(tabSelected) {
    this.filteredOptions = []
    this.subcategoryControls = []

    if(tabSelected === 0) {
      this.dataSource.data = this.getPLAccounts(this.companyService.selectedCompany.companyAccounts);
      this.dataSource.paginator = this.paginator;
      for (var i = 0; i < this.getPLAccounts(this.companyService.selectedCompany.companyAccounts).length; i++) {
        var filterOption: Observable<string[]>;
        var subcategoryControl = new FormControl();
        this.subcategoryControls.push(subcategoryControl);
        filterOption = subcategoryControl.valueChanges
          .pipe(
            startWith(''),
            map(value => this._filter(value))
          );
        this.filteredOptions.push(filterOption);
      }
    }else{
      this.dataSource.data = this.getBalanceAccounts(this.companyService.selectedCompany.companyAccounts);
      this.dataSource.paginator = this.balancePaginator
      for (var i = 0; i < this.getBalanceAccounts(this.companyService.selectedCompany.companyAccounts).length; i++) {
        var filterOption: Observable<string[]>;
        var subcategoryControl = new FormControl();
        this.subcategoryControls.push(subcategoryControl);
        filterOption = subcategoryControl.valueChanges
          .pipe(
            startWith(''),
            map(value => this._filter(value))
          );
        this.filteredOptions.push(filterOption);
      }
    }
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.subcategories.filter(option => option.toLowerCase().includes(filterValue));
  }

  getPLAccounts(accounts: AccountModel[]){
    return accounts.filter(acct=>{
      return acct.category === "Revenue" || acct.category ==="Expenses" || acct.category==="Cost of Sales"
    });
  }
  getBalanceAccounts(accounts: AccountModel[]){
    return accounts.filter(acct=>{
      return acct.category !== "Revenue" &&  acct.category !=="Expenses" && acct.category!=="Cost of Sales"
    });
  }


  changeSubcategory(account: AccountModel, option ){
    this.companyService.editAccountSubcategory(account, option)
      .subscribe(()=>{
        this.dataSource.data =[];
        this.initPagination(this.tabSelected)
        this.snackBar.open("Account updated",'Close',{
          duration: 2000,
        })
      })
  }

  tabChanged = (tabChangeEvent: MatTabChangeEvent): void => {
    this.tabSelected = tabChangeEvent.index;
    this.initPagination(tabChangeEvent.index)
  }

}
