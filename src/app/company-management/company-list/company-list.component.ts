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
  subscription: Subscription;

  constructor(private companyService: CompanyService, private router: Router, private route: ActivatedRoute) {

    this.subscription = this.companyService.companiesObservable
      .subscribe(companiesSnapshot => {
        this.companiesTable = new MatTableDataSource(this.companyService.companies);
        //If there's only one company, go to its snapshot
        if(companiesSnapshot.length===1 && this.companyService.selectedCompany===undefined){
          //TODO: Uncomment this code
          // this.companyClicked(new Company(action.key, action.payload.val().companyName,action.payload.val().currency ));
        }
      });
  }

  ngOnInit(): void {

  }

  companyClicked(company:Company){
    this.router.navigate(['/company-snapshot']);
    this.companyService.selectedCompany = company;
  }
  addCompanyClicked(){
    this.router.navigate(['company'], {relativeTo:this.route})
  }
  editCompanyClicked(companyId: string){
    console.log(companyId)
    this.router.navigate(['company', { id: companyId}], {relativeTo:this.route})
  }

  ngOnDestroy(): void {
    if(this.subscription)
    this.subscription.unsubscribe();
  }
}
