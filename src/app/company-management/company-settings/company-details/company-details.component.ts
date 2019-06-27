import {Component, OnDestroy, OnInit} from '@angular/core';
import {CompanyService} from '../../company.service';
import { Router} from '@angular/router';
import {AuthService} from '../../../user-authentication/auth.service';
import {Subscription} from 'rxjs';
import {Company} from '../../models/company.model';

@Component({
  selector: 'app-company-details',
  templateUrl: './company-details.component.html',
  styleUrls: ['./company-details.component.css']
})
export class CompanyDetailsComponent implements OnInit, OnDestroy {
  company: Company;
  requestCompanyInfo = false;
  loading = false;
  editMode = false;
  subscriptions: Subscription[]=[];
  loadingMessage: string;
  constructor(private companyService: CompanyService,
              private authService: AuthService,
              private router: Router) {}

  ngOnInit() {

  }

  listenForCompanyEvents(){
    let subscription: Subscription = this.companyService.companiesObservable
      .subscribe(companies => {
        companies.forEach(companySnapshot => {
          //TODO If company doesn't have Accounts fetched
          if(companySnapshot.type ==="child_added" && this.requestCompanyInfo){
            this.loading = true;
            this.loadingMessage = "Starting the  Millenium Falcon...";
            this.requestCompanyInfo = false;
            this.companyService.fetchCompanySource(companySnapshot.key, companySnapshot.payload.val().realm)
            let dataSubscription: Subscription = this.companyService.dataSource
              .subscribe(
                () => {
                  this.loadingMessage = "Preparing for hyperdrive...";
                  this.companyService.fetchTrialBalances(companySnapshot.key)
                    .subscribe(
                      () => {
                        this.company = this.companyService.getCompanyById(companySnapshot.key)
                        this.loadingMessage = "Made the Kessel Run in 12 parsecs...";
                        setTimeout(() => {
                          this.companyService.fetchCompanyUsers(this.company.companyId).subscribe(user=>{
                            this.companyService.selectedCompany = this.company;
                            this.router.navigate(['/account-classification'], {queryParams: { 'isCreating': true }});
                          })
                        }, 2000);

                      }
                    )
                });
            this.subscriptions.push(dataSubscription);
          }
        });
      });
    this.subscriptions.push(subscription);
  }



  quickbooksClicked(){
    var parameters = "location=1,width=800,height=650";
    parameters += ",left=" + (screen.width - 800) / 2 + ",top=" + (screen.height - 650) / 2;
    this.requestCompanyInfo = true;
    this.listenForCompanyEvents();
    // Launch Popup
    window.open("http://localhost:3000/connect_to_quickbooks?userId="+this.authService.user.uid,'connectPopup', parameters);
  }
  xeroClicked(){

  }
  csvClicked(){

  }


  ngOnDestroy(): void {
    for (let subscription of this.subscriptions){
      if(subscription)
        subscription.unsubscribe()
    }

  }
}
