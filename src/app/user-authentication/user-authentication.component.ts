import { Component, OnInit } from '@angular/core';
import {AuthService} from './auth.service';
import {ActivatedRoute, NavigationExtras, Params, Router} from '@angular/router';

@Component({
  selector: 'app-user-authentication',
  templateUrl: './user-authentication.component.html',
  styleUrls: ['./user-authentication.component.css']
})
export class UserAuthenticationComponent implements OnInit {

  constructor(private authService: AuthService,private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe(
      (queryParams: Params) => {
        if(queryParams['inviteId']!==undefined){
          this.router.navigate(['/signup'], {queryParams: { 'inviteId': queryParams['inviteId'] }})
        }else{
          this.router.navigate(['/login'], {relativeTo:this.route})
        }
      })


  }

}
