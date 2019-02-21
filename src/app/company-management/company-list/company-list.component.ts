import { Component, OnInit } from '@angular/core';
import {Company} from '../company.model';
import {MatTableDataSource} from '@angular/material';
import {ActivatedRoute, Router} from '@angular/router';
import {CompanyService} from '../company.service';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.css']
})
export class CompanyListComponent implements OnInit {
  companies: MatTableDataSource<any[]>;
  companiesArray = new Array()

  displayedColumns: string[] = ['companyName', 'email', 'actions', 'addCompany'];

  constructor(private companyService: CompanyService, private router: Router, private route: ActivatedRoute) {

    this.companyService.getCompanies()
      .subscribe(companiesSnapshot => {
        this.companies = new MatTableDataSource(this.companiesArray);
        companiesSnapshot.forEach(company => {
          //If there's only one company, go to its snapshot
          if(companiesSnapshot.length===1 && this.companyService.selectedCompany===undefined){
            //TODO: Uncomment this code
            // this.companyClicked(new Company(action.key, action.payload.val().companyName,action.payload.val().currency ));
          }
          this.companiesArray.push(new Company(company.key, company.payload.val().name,company.payload.val().email, company.payload.val().realm));

        });
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
}
