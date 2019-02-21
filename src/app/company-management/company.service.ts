import { Injectable } from '@angular/core';
import {Company} from './company.model';
import {AngularFireDatabase} from '@angular/fire/database';
import {AuthService} from '../user-authentication/auth.service';
import {HttpClient} from '@angular/common/http';
import {MatTableDataSource} from '@angular/material';
@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  selectedCompany: Company;
  requestCompanyInfo = false;
  constructor(private db: AngularFireDatabase, private authService: AuthService, private http: HttpClient ) {
  }

  getCompanies(){
    return this.db.list<Company>('user-companies/'+this.authService.user.uid).snapshotChanges(["child_added"])
  }

  getCompanyData(){
    this.http.get('http://localhost:3000/get_company_data')
      .subscribe(
        (data: any) => {
          console.log(JSON.stringify(data))
        }, // success path
        error => console.log(JSON.stringify(error)) // error path
      );
  }

}
