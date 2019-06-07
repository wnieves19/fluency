import {Component, OnDestroy, OnInit} from '@angular/core';
import {Company} from '../models/company.model';
import {MatTableDataSource} from '@angular/material';
import {ActivatedRoute, Router} from '@angular/router';
import {CompanyService} from '../company.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.css']
})
export class CompanyListComponent implements OnInit, OnDestroy {
  companiesTable: MatTableDataSource<any[]>;
  displayedColumns: string[] = ['companyName', 'email', 'actions', 'addCompany'];
  subscriptions: Subscription[]=[];
  loading = true;
  noCompanies = false;
  constructor(private companyService: CompanyService, private router: Router, private route: ActivatedRoute) {

    let subscription = this.companyService.companiesObservable
      .subscribe(companiesSnapshot => {
        //If there's only one company, go to its snapshot
        // if(companiesSnapshot.length===1 && this.companyService.selectedCompany===undefined){
        //   this.loadCompanyData(this.companyService.companies[0]);
        // }else
          if(companiesSnapshot.length>0){
          this.companiesTable = new MatTableDataSource(this.companyService.companies);
          this.loading = false;
        }else if(this.companyService.companies.length === 0){
          this.noCompanies = true;
          this.loading = false;
        }
      });
    this.subscriptions.push(subscription)
  }

  private loadCompanyData(company: Company) {
    this.loading = true;
    let tbSubscription = this.companyService.fetchTrialBalances(company.companyId)
      .subscribe(() => {
          this.companyService.fetchCompanyUsers(company.companyId).subscribe(user=>{
            this.companyService.selectedCompany = company;
            this.router.navigate(['/company-snapshot']);
            this.loading = true;
          })
        }
      );
    this.subscriptions.push(tbSubscription);
  }

  ngOnInit(): void {

  }

  addCompanyClicked(){
    this.router.navigate(['company'], {relativeTo:this.route})
  }
  editCompanyClicked(companyId: string){
    console.log(companyId)
    this.router.navigate(['company', { id: companyId}], {relativeTo:this.route})
  }

  ngOnDestroy(): void {
    for (let subscription of this.subscriptions){
      if(subscription)
        subscription.unsubscribe()
    }
  }
}
