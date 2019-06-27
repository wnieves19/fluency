import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
@Component({
  selector: 'app-account-classification',
  templateUrl: './account-classification.component.html',
  styleUrls: ['./account-classification.component.css']
})
export class AccountClassificationComponent implements OnInit {
  isCreating = false;
  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.queryParams.subscribe(
      (queryParams: Params) => {
        if (queryParams['isCreating']) {
          this.isCreating = queryParams['isCreating']
        }
      });
  }

  nextClicked(){
    this.router.navigate(['/company-snapshot'])
  }

}
