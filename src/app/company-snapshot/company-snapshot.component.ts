import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MediaMatcher} from '@angular/cdk/layout';
import {AuthService} from '../user-authentication/auth.service';
import {CompanyService} from '../company-management/company.service';
import {Company} from '../company-management/models/company.model';
import {Subscription} from 'rxjs';
import {MatSnackBar} from '@angular/material';
@Component({
  selector: 'app-company-snapshot',
  templateUrl: './company-snapshot.component.html',
  styleUrls: ['./company-snapshot.component.css']
})
export class CompanySnapshotComponent implements OnInit, OnDestroy {
  company: Company;
  mobileQuery: MediaQueryList;
  subscriptions: Subscription[]=[];
  fillerNav = [{name: 'Liquidity', route: 'liquidity'},
    // {name: 'Profitability', route: 'profitability'},
    // {name: 'Performance', route: 'performance'},
    {name: 'Company Settings', route: 'settings'}
  ];

  private _mobileQueryListener: () => void;

  constructor(private authService: AuthService,
              changeDetectorRef: ChangeDetectorRef,
              media: MediaMatcher,
              private router: Router,
              private route: ActivatedRoute,
              private companyService: CompanyService,
              private snackBar: MatSnackBar) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.company = companyService.selectedCompany
  }

  navigateToRoute(routeName: string) {
    this.router.navigate([routeName], {relativeTo: this.route});
  }
  ngOnInit() {

  }
  requestDataUpdate(){
    this.companyService.updateCompanySource()
    let dataSubscription: Subscription = this.companyService.dataSource
      .subscribe(
        (response) => {
          this.snackBar.open(response.message,'Close',{
            duration: 2000,
          }).afterDismissed().subscribe(()=>{
            location.reload();
          })

        });
    this.subscriptions.push(dataSubscription);
  }

  onLogoutClicked(){
    this.authService.logout();
  }

  ngOnDestroy(): void {
    for (let subscription of this.subscriptions){
      if(subscription)
        subscription.unsubscribe()
    }

  }

}
