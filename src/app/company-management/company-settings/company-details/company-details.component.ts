import {Component, OnDestroy, OnInit} from '@angular/core';
import {CompanyService} from '../../company.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {AuthService} from '../../../user-authentication/auth.service';
import {Subscription} from 'rxjs';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Company} from '../../company.model';
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
  subscription: Subscription;
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
    if(this.subscription)
      this.subscription.unsubscribe()
  }
}
