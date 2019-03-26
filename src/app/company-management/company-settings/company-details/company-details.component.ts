import {Component, OnDestroy, OnInit} from '@angular/core';
import {CompanyService} from '../../company.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {AuthService} from '../../../user-authentication/auth.service';
import {Subscription} from 'rxjs';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Company} from '../../models/company.model';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-company-details',
  templateUrl: './company-details.component.html',
  styleUrls: ['./company-details.component.css']
})
export class CompanyDetailsComponent implements OnInit, OnDestroy {
  companyDetailsForm: FormGroup;
  company: Company;
  requestCompanyInfo = false;
  loading = false;
  editMode = false;
  subscriptions: Subscription[]=[];
  loadingMessage: string;
  constructor(private companyService: CompanyService,
              private authService: AuthService,
              private router: Router,
              private route: ActivatedRoute,
              private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.companyDetailsForm = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', Validators.required),
      address: new FormControl(''),
      city: new FormControl(''),
      state: new FormControl(''),
      zip: new FormControl(''),
      url: new FormControl(''),
    })

    this.route.params.subscribe(
      (queryParams: Params) => {
        if(queryParams['id']){
          this.editMode = true;
          this.loadCompany(queryParams['id']);
        }
      }
    );

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
                          this.router.navigate(['/company-snapshot']);
                          this.companyService.selectedCompany = this.company;
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

  loadCompany(id: string){
    this.company = this.companyService.getCompanyById(id);
    this.companyDetailsForm.get('name').setValue(this.company.name);
    this.companyDetailsForm.get('email').setValue(this.company.email);
    this.companyDetailsForm.get('phone').setValue(this.company.phone);
    this.companyDetailsForm.get('address').setValue(this.company.address);
    this.companyDetailsForm.get('city').setValue(this.company.city);
    this.companyDetailsForm.get('state').setValue(this.company.state);
    this.companyDetailsForm.get('zip').setValue(this.company.zip);
    this.companyDetailsForm.get('url').setValue(this.company.url);
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

  saveCompanyDetails(){
    this.company.name = this.companyDetailsForm.get('name').value,
      this.company.email = this.companyDetailsForm.get('email').value,
      this.company.phone = this.companyDetailsForm.get('phone').value,
      this.company.address = this.companyDetailsForm.get('address').value,
      this.company.city = this.companyDetailsForm.get('city').value,
      this.company.state = this.companyDetailsForm.get('state').value,
      this.company.zip = this.companyDetailsForm.get('zip').value,
      this.company.url = this.companyDetailsForm.get('url').value

    this.companyService.updateCompany(this.company)
      .then((val)=>{
        this.snackBar.open('Profile saved','Close',{
          duration: 2000,
        })
        this.router.navigate(['../'], {relativeTo: this.route});
      });

  }

  ngOnDestroy(): void {
    for (let subscription of this.subscriptions){
      if(subscription)
        subscription.unsubscribe()
    }

  }
}
