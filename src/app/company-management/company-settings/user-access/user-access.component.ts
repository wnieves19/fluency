import { Component, OnInit } from '@angular/core';
import {CompanyService} from '../../company.service';
import {UserDetailComponent} from './user-detail/user-detail.component';
import {MatDialog} from '@angular/material';

@Component({
  selector: 'app-user-access',
  templateUrl: './user-access.component.html',
  styleUrls: ['./user-access.component.css']
})
export class UserAccessComponent implements OnInit {
  displayedColumns: string[] = ['userName', 'email', 'roles', 'addUser'];
  roles: string[] = ['Read','Edit', 'Admin'];
  userList
  constructor(private dialog: MatDialog, private companyService: CompanyService) { }

  ngOnInit() {
    this.userList = this.companyService.companyUsers;
  }

  addUserClicked(){
    this.dialog.open(UserDetailComponent, {
      width: '400px',
      data: {widgetName: "test"}
    });
  }

  changeUserRole(){

  }

  deleteUser(){

  }

}
