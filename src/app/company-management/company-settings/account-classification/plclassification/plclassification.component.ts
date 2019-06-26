import {Component, OnInit, ViewChild} from '@angular/core';
import {AccountModel} from '../../../models/account.model';
import {MatPaginator, MatSnackBar, MatTableDataSource} from '@angular/material';
import {map, startWith} from 'rxjs/operators';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {CompanyService} from '../../../company.service';

@Component({
  selector: 'app-plclassification',
  templateUrl: './plclassification.component.html',
  styleUrls: ['./plclassification.component.css']
})
export class PlclassificationComponent implements OnInit {
  displayedColumns: string[] = ['name', 'category', 'subcategory'];
  subcategories: string[] = [ 'Revenue',  'Fixed COS', 'Variable COS', 'Fixed Expenses',
    'Interest Expense', 'Variable Expenses',  'Expenses', 'Dividend Income', 'Interest Earnings', "Other Income/Loss"];

  subcategoryControls = new Array()
  filteredOptions = new Array();
  dataSource = new MatTableDataSource<AccountModel>(this.getPLAccounts(this.companyService.selectedCompany.companyAccounts));
  @ViewChild('pl', {static: true}) paginator: MatPaginator;
  constructor(private snackBar: MatSnackBar, private companyService: CompanyService) { }

  ngOnInit() {

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

  changeSubcategory(account: AccountModel, option ){
    this.companyService.editAccountSubcategory(account, option)
      .subscribe(()=>{
        this.dataSource.data =[];
        this.dataSource.data = this.getPLAccounts(this.companyService.selectedCompany.companyAccounts);
        this.snackBar.open("Account updated",'Close',{
          duration: 2000,
        })
      })
  }

}
