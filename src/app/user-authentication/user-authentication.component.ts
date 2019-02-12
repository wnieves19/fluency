import { Component, OnInit } from '@angular/core';
import {AuthService} from './auth.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-user-authentication',
  templateUrl: './user-authentication.component.html',
  styleUrls: ['./user-authentication.component.css']
})
export class UserAuthenticationComponent implements OnInit {

  constructor(private authService: AuthService,private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {

    this.router.navigate(['/login'], {relativeTo:this.route})

  }

}
