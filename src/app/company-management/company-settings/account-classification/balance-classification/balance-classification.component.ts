import {Component, OnInit, ViewChild} from '@angular/core';
import {AccountModel} from '../../../models/account.model';
import {MatPaginator, MatSnackBar, MatTableDataSource} from '@angular/material';
import {map, startWith} from 'rxjs/operators';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {CompanyService} from '../../../company.service';

@Component({
  selector: 'app-balance-classification',
  templateUrl: './balance-classification.component.html',
  styleUrls: ['./balance-classification.component.css']
})
export class BalanceClassificationComponent implements OnInit {
  displayedColumns: string[] = ['name', 'category', 'subcategory'];
  subcategories: string[] = ['Cash', 'Accounts Receivable', 'Other Current Assets', 'Intangible Assets', 'Fixed Assets',
    'Other Assets', 'Accounts Payable', 'Short Term Debt', 'Tax Liability','Other Current Liabilities', 'Long Term Liability',
    'Equity', 'Retained Earnings' ];

  subcategoryControls = new Array()
  filteredOptions = new Array();
  dataSource = new MatTableDataSource<AccountModel>(this.getBalanceAccounts(this.companyService.selectedCompany.companyAccounts));

  @ViewChild('balance', {static: true}) balancePaginator: MatPaginator;
  constructor(private snackBar: MatSnackBar, private companyService: CompanyService) { }

  ngOnInit() {
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
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.subcategories.filter(option => option.toLowerCase().includes(filterValue));
  }

  getBalanceAccounts(accounts: AccountModel[]){
    return accounts.filter(acct=>{
      return acct.category !== "Revenue" && acct.category !=="Expenses" && acct.category!=="Cost of Sales"
    });
  }

  changeSubcategory(account: AccountModel, option ){
    this.companyService.editAccountSubcategory(account, option)
      .subscribe(()=>{
        this.dataSource.data =[];
        this.dataSource.data = this.getBalanceAccounts(this.companyService.selectedCompany.companyAccounts);
        this.snackBar.open("Account updated",'Close',{
          duration: 2000,
        })
      })
  }

}
