import { Component, OnInit } from '@angular/core';
import {Company} from '../company.model';
import {MatTableDataSource} from '@angular/material';
import {Router} from '@angular/router';
import {CompanyService} from '../company.service';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.css']
})
export class CompanyListComponent implements OnInit {
  companies: MatTableDataSource<any[]>;
  companiesArray = new Array()

  displayedColumns: string[] = ['companyName', 'currency', 'actions'];

  constructor(private companyService: CompanyService, private router: Router) {

    this.companyService.getCompanies()
      .subscribe(actions => {
        this.companies = new MatTableDataSource(this.companiesArray);
        actions.forEach(action => {
          //If there's only one company, go to its snapshot
          if(actions.length===1){
            this.companySelected(new Company(action.key, action.payload.val().companyName,action.payload.val().currency ));
          }
          this.companiesArray.push(new Company(action.key, action.payload.val().companyName,action.payload.val().currency ));

        });
      });
  }

  ngOnInit(): void {

  }

  companySelected(company:Company){
    this.router.navigate(['/company-snapshot']);
    this.companyService.selectedCompany = company;
  }
}
