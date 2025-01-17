import {Component, OnInit} from '@angular/core';
import {AuthService} from './user-authentication/auth.service';
import {ActivatedRoute, NavigationExtras, Params, Router} from '@angular/router';

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
        }else if(queryParams['action'] ==='companyExists'){
          alert("Company is already in Fluency");
          window.close();
        }else{
          this.authService.afAuth.authState.subscribe(user => {
            if (user){
              this.router.navigate(['/company-management']);
            }
            else{
              if(queryParams['inviteId'] ) {
                this.router.navigate(['/user-authentication'], {queryParams: { 'inviteId': queryParams['inviteId'] }});
              }else{
                this.router.navigate(['/user-authentication']);
              }
            }
          })

        }
      }
    );

  }
}
