import {Component, Inject, OnInit} from '@angular/core';
import {CompanyService} from '../../company.service';
import {ActivatedRoute, Router} from '@angular/router';
import {DOCUMENT} from '@angular/common';
import {AuthService} from '../../../user-authentication/auth.service';

@Component({
  selector: 'app-company-details',
  templateUrl: './company-details.component.html',
  styleUrls: ['./company-details.component.css']
})
export class CompanyDetailsComponent implements OnInit {
loading = false;
loadingMessage: string;
  constructor(private companyService: CompanyService,private authService: AuthService, private router: Router, private route: ActivatedRoute) {
    companyService.getCompanies().subscribe(companies => {
      companies.forEach(company => {
        if(company.type==="child_added" && companyService.requestCompanyInfo){
          this.loading = true;
          this.loadingMessage = "Starting the  Millenium Falcon...";
          console.log("New company created: " + company.payload.val().name)
          this.companyService.getCompanyData(company.key, company.payload.val().realm)
            .subscribe(
            (val) => {
              this.loadingMessage = "Preparing for hyperdrive...";
            },
            response => {
              console.log("POST call in error", response);
            },
            () => {
              console.log("The POST observable is now completed.");
            });
          //TODO:get companyId firebase and  realmId and call the getCompanyData() method in company.service
        }
      });
    });
  }

  ngOnInit() {
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
