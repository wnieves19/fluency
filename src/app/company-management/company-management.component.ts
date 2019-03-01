import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {AuthService} from '../user-authentication/auth.service';

@Component({
  selector: 'app-company-management',
  templateUrl: './company-management.component.html',
  styleUrls: ['./company-management.component.css']
})
export class CompanyManagementComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute, private authService: AuthService) { }

  ngOnInit() {

    this.route.queryParams.subscribe(
      (queryParams: Params) => {
        if(queryParams['action'] === 'close' ){
          window.close();
        }
      }
    );
  }
  onLogoutClicked(){
    this.authService.logout();
  }

}
