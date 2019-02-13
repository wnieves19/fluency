import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MediaMatcher} from '@angular/cdk/layout';
import {AuthService} from '../user-authentication/auth.service';

@Component({
  selector: 'app-company-snapshot',
  templateUrl: './company-snapshot.component.html',
  styleUrls: ['./company-snapshot.component.css']
})
export class CompanySnapshotComponent implements OnInit {

  mobileQuery: MediaQueryList;
  fillerNav = [{name: 'Liquidity', route: 'liquidity'},
    {name: 'Profitability', route: 'profitability'},
     {name: 'Performance', route: 'performance'}];

  private _mobileQueryListener: () => void;

  constructor(private authService: AuthService, changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private router: Router, private route: ActivatedRoute) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  navigateToRoute(routeName: string) {
    this.router.navigate([routeName], {relativeTo: this.route});
    console.log(routeName)
  }
  ngOnInit() {
  }

  onLogoutClicked(){
    this.authService.logout();
  }

}
