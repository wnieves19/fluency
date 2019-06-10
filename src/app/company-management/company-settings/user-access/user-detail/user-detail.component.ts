import {Component, Inject, OnInit} from '@angular/core';
import {Constants} from '../../../../constants';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CompanyService} from '../../../company.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {
  userForm: FormGroup;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private constants: Constants,
              public dialogRef: MatDialogRef<UserDetailComponent>, private companyService: CompanyService) { }

  ngOnInit() {
    this.userForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      role: new FormControl('', Validators.required)
    })
  }

  createUser(){
    this.companyService.createUserInviteRequest(this.userForm.get('email').value, this.userForm.get('role').value)
      .subscribe(()=>{
        this.dialogRef.close();
    });
  }

}
