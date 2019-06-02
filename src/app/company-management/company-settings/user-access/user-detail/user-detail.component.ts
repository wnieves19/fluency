import {Component, Inject, OnInit} from '@angular/core';
import {Constants} from '../../../../constants';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {
  userForm: FormGroup;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private constants: Constants,
              public dialogRef: MatDialogRef<UserDetailComponent>) { }

  ngOnInit() {
    this.userForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      role: new FormControl(Validators.required)
    })
  }

  createUser(){

  }

}
