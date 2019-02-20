import { Injectable } from '@angular/core';
import {Company} from './company.model';
import {AngularFireDatabase} from '@angular/fire/database';
import {AuthService} from '../user-authentication/auth.service';
import {HttpClient} from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  selectedCompany: Company;
  constructor(private db: AngularFireDatabase, private authService: AuthService, private http: HttpClient ) { }

  getCompanies(){
    return this.db.list<Company>('user-companies/'+this.authService.user.uid).snapshotChanges()
  }

  getCompanyInfo(){
    this.http.get('http://localhost:3000/api_call')
      .subscribe(
        (data: any) => {
          console.log(JSON.stringify(data))
        }, // success path
        error => console.log(JSON.stringify(error)) // error path
      );
  }

}
