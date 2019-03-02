import {Component, OnDestroy, OnInit} from '@angular/core';
import {CompanyService} from '../../company.service';
import {ActivatedRoute, Params} from '@angular/router';
import {AuthService} from '../../../user-authentication/auth.service';
import {Subscription} from 'rxjs';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Company} from '../../company.model';

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
  subscription: Subscription;
  loadingMessage: string;
  constructor(private companyService: CompanyService,
              private authService: AuthService,
              private route: ActivatedRoute) {}

  ngOnInit() {
    this.companyDetailsForm = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      phone: new FormControl('', [Validators.required, Validators.email]),
      address: new FormControl(''),
      city: new FormControl(''),
      state: new FormControl(''),
      zip: new FormControl(''),
      webAddress: new FormControl(''),
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
    this.subscription = this.companyService.fetchCompanies().subscribe(companies => {
      companies.forEach(companySnapshot => {
        if(companySnapshot.type==="child_added" && this.requestCompanyInfo){
          this.loading = true;
          this.companyService.getCompanyDataFromSource(companySnapshot.key, companySnapshot.payload.val().realm)
            .subscribe(
              (val) => {
                this.loadingMessage = "Starting the  Millenium Falcon...";
              });
        }
      });
    });
  }

  loadCompany(id: string){
    this.company = this.companyService.getCompanyById(id);
    console.log("SELECTED COMPANY " + this.company.name)
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
    if(this.subscription)
    this.subscription.unsubscribe()
  }
}
