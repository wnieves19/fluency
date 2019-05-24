import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {CompanyService} from '../../../company.service';
import {AuthService} from '../../../../user-authentication/auth.service';
import {MatSnackBar} from '@angular/material';
import {Company} from '../../../models/company.model';

@Component({
  selector: 'app-company-details-form',
  templateUrl: './company-details-form.component.html',
  styleUrls: ['./company-details-form.component.css']
})
export class CompanyDetailsFormComponent implements OnInit {
  companyDetailsForm: FormGroup;
  company: Company;
  editMode = false;

  constructor(private companyService: CompanyService,
              private authService: AuthService,
              private router: Router,
              private route: ActivatedRoute,
              private snackBar: MatSnackBar) { }

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
      });

  }


}
