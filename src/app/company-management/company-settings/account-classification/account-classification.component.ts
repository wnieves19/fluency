import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
@Component({
  selector: 'app-account-classification',
  templateUrl: './account-classification.component.html',
  styleUrls: ['./account-classification.component.css']
})
export class AccountClassificationComponent implements OnInit {
  isCreating = true;
  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    var id = this.route.snapshot.params.id;
    if(id)this.isCreating=false;
  }

  nextClicked(){
    this.router.navigate(['/company-snapshot'])
  }

}
