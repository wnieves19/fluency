import {Component, OnInit} from '@angular/core';
import {AuthService} from './user-authentication/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  constructor(private authService: AuthService, private router: Router){
  }

  ngOnInit() {
    this.authService.afAuth.authState.subscribe(user => {
      if (user){
        this.router.navigate(['/company-management']);
      }
      else{
        this.router.navigate(['/user-authentication']);
      }
    })
  }
}
