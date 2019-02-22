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
  selectedCompany: Company;
  requestCompanyInfo = false;
  dataSource: Observable<any>
  constructor(private db: AngularFireDatabase, private authService: AuthService, private http: HttpClient ) {
  }

  getCompanies(){
    return this.db.list<Company>('user-companies/'+this.authService.user.uid).snapshotChanges(["child_added"])
  }

  getCompanyDataFromSource(companyKey: string, realmId: string){
    this.dataSource = this.http.post("http://localhost:3000/get_company_data",
      {
        "companyId": companyKey,
        "realmId": realmId
      })
      this.dataSource.subscribe(
      (val) => {
         this.db.list('company-data/'+companyKey).snapshotChanges(["child_added"])

      });


    return this.dataSource;
  }


}
