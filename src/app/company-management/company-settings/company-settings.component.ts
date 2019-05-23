import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CompanyService} from '../company.service';

@Component({
  selector: 'app-company-settings',
  templateUrl: './company-settings.component.html',
  styleUrls: ['./company-settings.component.css']
})
export class CompanySettingsComponent implements OnInit {
  companyId;
  settingsNavigation = [{name: 'Company details', route: 'company-details-form'},
    {name: 'User access', route: 'user-access'},
    {name: 'Delete company', route: 'delete-company'}
  ];
  constructor(private companyService: CompanyService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.companyId = this.companyService.selectedCompany.companyId;
    this.navigateToRoute('company-details-form')
  }

  navigateToRoute(routeName: string) {
    this.router.navigate([routeName, {id: this.companyId}], {relativeTo: this.route});
  }
}
