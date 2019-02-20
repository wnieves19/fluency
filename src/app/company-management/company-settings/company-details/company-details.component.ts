import {Component, Inject, OnInit} from '@angular/core';
import {CompanyService} from '../../company.service';
import {ActivatedRoute, Router} from '@angular/router';
import {DOCUMENT} from '@angular/common';

@Component({
  selector: 'app-company-details',
  templateUrl: './company-details.component.html',
  styleUrls: ['./company-details.component.css']
})
export class CompanyDetailsComponent implements OnInit {

  constructor(private companyService: CompanyService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
  }

  quickbooksClicked(){
    var parameters = "location=1,width=800,height=650";
    parameters += ",left=" + (screen.width - 800) / 2 + ",top=" + (screen.height - 650) / 2;
    // Launch Popup
    window.open("http://localhost:3000/connect_to_quickbooks",'connectPopup', parameters);
  }
  getCompanyInfo(){
    this.companyService.getCompanyInfo();
  }
}
