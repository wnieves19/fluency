import {Component, Inject, OnInit} from '@angular/core';
import {UserDetailComponent} from '../user-access/user-detail/user-detail.component';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent implements OnInit {
message
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<ConfirmDialogComponent>,) { }

  ngOnInit() {
  this.message = this.data.message;
  }

  okClicked(){
    this.dialogRef.close({result: "OK"});
  }

}
