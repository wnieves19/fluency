import { Injectable } from '@angular/core';
import {Company} from './company.model';
import {AngularFireDatabase} from '@angular/fire/database';
import {AuthService} from '../user-authentication/auth.service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  companies = new Array();
  //TODO: Replace with query parameter
  selectedCompany: Company;
  dataSource: Observable<any>
  companiesObservable: Observable<any>;
  constructor(private db: AngularFireDatabase, private authService: AuthService, private http: HttpClient ) {
    this.fetchCompanies()
      .subscribe(companiesSnapshot => {
        companiesSnapshot.forEach(company => {
          this.companies.push(new Company(company.key, company.payload.val().name,company.payload.val().email,
            company.payload.val().phone,company.payload.val().address,company.payload.val().city,
            company.payload.val().state, company.payload.val().zip,company.payload.val().url,company.payload.val().realm));
        });
      });
  }

  fetchCompanies(){
    this.companiesObservable = this.db.list<Company>('user-companies/'+this.authService.user.uid).snapshotChanges(["child_added"])
    return this.companiesObservable;
  }

  getCompanyById(id: string){
    for(let company of this.companies){
      if(company.companyId === id){
        return company;
      }
    }
  }

  updateCompany(company: Company){
    return this.db.list('user-companies/'+this.authService.user.uid).update(company.companyId,company)
  }
  getCompanyDataFromSource(companyId: string, realmId: string){
    this.dataSource = this.http.post("http://localhost:3000/get_company_data",
      {
        "companyId": companyId,
        "realmId": realmId
      })
    // this.dataSource.subscribe(
    // (val) => {
    //    this.db.list('company-data/'+companyKey).snapshotChanges(["child_added"])
    //
    // });


    return this.dataSource;
  }


}
