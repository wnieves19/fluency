import { Injectable } from '@angular/core';
import {Company} from './company.model';
import {AngularFireDatabase} from '@angular/fire/database';
import {AuthService} from '../user-authentication/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  selectedCompany: Company;

  constructor(private db: AngularFireDatabase, private authService: AuthService,  ) { }

  getCompanies(){
    return this.db.list<Company>('user-companies/'+this.authService.user.uid).snapshotChanges()
  }

}
