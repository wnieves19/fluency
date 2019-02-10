import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {MediaMatcher} from '@angular/cdk/layout';

@Component({
  selector: 'app-company-snapshot',
  templateUrl: './company-snapshot.component.html',
  styleUrls: ['./company-snapshot.component.css']
})
export class CompanySnapshotComponent implements OnInit {

  mobileQuery: MediaQueryList;
  fillerNav = [{name: 'Profitability', route: '/profitability'},
    {name: 'Liquidity', route: '/liquidity'}, {name: 'Productivity',
      route: '/productivity'}];

  private _mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private router: Router) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  navigateToRoute(routeName: string) {
    this.router.navigate([routeName]);
  }
  ngOnInit() {
  }

}
