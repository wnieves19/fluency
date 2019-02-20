import {Component, OnInit} from '@angular/core';
import {AuthService} from './user-authentication/auth.service';
import {ActivatedRoute, Params, Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute){
  }

  ngOnInit() {
    this.route.queryParams.subscribe(
      (queryParams: Params) => {
        if(queryParams['action'] === 'close' ){
          window.close();
        }
      }
    );
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
