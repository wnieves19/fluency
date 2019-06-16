import { Component, OnInit } from '@angular/core';
import {CompanyService} from '../../company.service';
import {UserDetailComponent} from './user-detail/user-detail.component';
import {MatDialog, MatDialogRef, MatSnackBar, MatTableDataSource} from '@angular/material';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';
import {AuthService} from '../../../user-authentication/auth.service';
import {UserModel} from '../../models/user.model';
import {DataSource} from '@angular/cdk/collections';

@Component({
  selector: 'app-user-access',
  templateUrl: './user-access.component.html',
  styleUrls: ['./user-access.component.css']
})
export class UserAccessComponent implements OnInit {
  displayedColumns: string[] = ['userName', 'email', 'roles', 'addUser'];
  roles: string[] = ['Read','Edit', 'Admin'];
  userList = new MatTableDataSource<UserModel>(this.companyService.companyUsers);

  confirmDialogComponent: MatDialogRef<ConfirmDialogComponent>;

  constructor(private authService: AuthService, private dialog: MatDialog, private snackBar: MatSnackBar, private companyService: CompanyService) { }

  ngOnInit() {

  }

  addUserClicked(){
    if(!this.companyService.isAdmin(this.authService.user.uid)){
      this.snackBar.open("You don't have admin privileges",'Close',{
        duration: 2000,
      })
      return
    }
    this.dialog.open(UserDetailComponent, {
      width: '400px'
    });
  }

  changeUserRole(userToEdit: UserModel,  newRole: string){
    if(!this.companyService.isAdmin(this.authService.user.uid)){
      this.snackBar.open("You don't have admin privileges",'Close',{
        duration: 2000,
      })
      return
    }

    var user = this.companyService.companyUsers.filter(usr=>{
      return usr.id === userToEdit.id;
    })
    if(user[0].id === this.authService.user.uid){
      this.snackBar.open("You can't edit your role",'Close',{
        duration: 2000,
      })
      return;
    };
    this.companyService.changeUserRole(user[0], newRole)
      .subscribe(()=>{
        this.userList.data =[];
        this.userList.data = this.companyService.companyUsers;
        this.snackBar.open(userToEdit.firstName+ '\'s user role changed to '+newRole,'Close',{
          duration: 2000,
        })
      })

  }

  /**
   * Allows Admin users to remove users from company
   * @param user
   */
  removeUserClicked(user){
    if(!this.companyService.isAdmin(this.authService.user.uid)){
      this.snackBar.open("You don't have admin privileges",'Close',{
        duration: 2000,
      })
      return
    }

    if(user.id === this.authService.user.uid){
      this.snackBar.open("You can't delete yourself",'Close',{
        duration: 2000,
      })
      return;
    };
    this.confirmDialogComponent = this.dialog.open(ConfirmDialogComponent,{
      width: '300px',
      data: {message: "Are you sure you want to delete "+user.firstName + " " + user.lastName}
    });
    this.confirmDialogComponent.afterClosed()
      .subscribe(action => {
        if(action.result==="OK"){
          //TODO: Remove from db
          this.companyService.removeUserFromCompany(user.id)
            .subscribe(result =>{
                  this.userList.data =[];
                   this.userList.data = this.companyService.companyUsers;
                  this.snackBar.open("User was removed",'Close',{
                    duration: 2000,
                  })
            })

        }
      })
  }

}
