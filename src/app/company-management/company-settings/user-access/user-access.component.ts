import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-access',
  templateUrl: './user-access.component.html',
  styleUrls: ['./user-access.component.css']
})
export class UserAccessComponent implements OnInit {
  displayedColumns: string[] = ['userName', 'email', 'roles', 'addUser'];
  roles: string[] = ['Read','Edit', 'Admin'];
  userList = [{name: "Wilfredo Nieves", email : "w.nieves19@gmail.com", role: "Admin"}, {name: "Jose Ruiz", email:"jruiz@optivon.net", role: "Read"}]

  constructor() { }

  ngOnInit() {
  }

  addUserClicked(){

  }

  changeUserRole(){

  }
  deleteUser(){

  }

}
