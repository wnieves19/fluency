import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSnackBar, MatTableDataSource} from '@angular/material';
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

  dataSource = new MatTableDataSource<AccountModel>(this.companyService.selectedCompany.companyAccounts);
  subcategoryControls = new Array()
  filteredOptions = new Array();

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private snackBar: MatSnackBar, private companyService: CompanyService) { }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    for(var i = 0; i < this.companyService.selectedCompany.companyAccounts.length; i ++){
      var filterOption: Observable<string[]>
      var subcategoryControl = new FormControl();
      this.subcategoryControls.push(subcategoryControl);
      filterOption = subcategoryControl.valueChanges
        .pipe(
          startWith(''),
          map(value => this._filter(value))
        );
      this.filteredOptions.push(filterOption)
    }
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.subcategories.filter(option => option.toLowerCase().includes(filterValue));
  }

  changeSubcategory(account: AccountModel, option ){
    this.companyService.editAccountSubcategory(account, option)
      .subscribe(()=>{
        this.dataSource.data =[];
        this.dataSource.data = this.companyService.selectedCompany.companyAccounts;

        this.snackBar.open("Account updated",'Close',{
          duration: 2000,
        })

      })
  }

}
