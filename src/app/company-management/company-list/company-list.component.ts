import { Component, OnInit } from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';
import {Observable} from 'rxjs';
import {AuthService} from '../../user-authentication/auth.service';

interface Company{
  companyName: string,
  currency: string
}
@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.css']
})
export class CompanyListComponent implements OnInit {
  companies: Observable<any[]>;
  displayedColumns: string[] = ['companyName', 'currency'];

  constructor(private db: AngularFireDatabase, private authService: AuthService) {

  }
  ngOnInit(): void {
    this.companies = this.db.list<Company>('user-companies/'+this.authService.user.uid).valueChanges();
  }
}
