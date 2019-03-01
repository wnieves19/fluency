import {Component, Inject, OnInit} from '@angular/core';
import {CompanyService} from '../../company.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {DOCUMENT} from '@angular/common';
import {AuthService} from '../../../user-authentication/auth.service';

@Component({
  selector: 'app-company-details',
  templateUrl: './company-details.component.html',
  styleUrls: ['./company-details.component.css']
})
export class CompanyDetailsComponent implements OnInit {
  loading = false;
  editMode = false;
  loadingMessage: string;
  constructor(private companyService: CompanyService,
              private authService: AuthService,
              private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(
      (queryParams: Params) => {
        if(queryParams['id']){
          console.log("OOOPS " + queryParams['id'])
          this.editMode = true;
          this.loadCompany(queryParams['id']);
        }
      }
    );
    this.companyService.getCompanies().subscribe(companies => {
      companies.forEach(companySnapshot => {
        if(companySnapshot.type==="child_added" && this.companyService.requestCompanyInfo){
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

  }

  quickbooksClicked(){
    var parameters = "location=1,width=800,height=650";
    parameters += ",left=" + (screen.width - 800) / 2 + ",top=" + (screen.height - 650) / 2;
    this.companyService.requestCompanyInfo = true;
    // Launch Popup
    window.open("http://localhost:3000/connect_to_quickbooks?userId="+this.authService.user.uid,'connectPopup', parameters);
  }
  xeroClicked(){

  }
  csvClicked(){

  }
}
