import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {MaterialModule} from './material-module';
import { CompanyListComponent } from './company-management/company-list/company-list.component';
import { CompanyItemComponent } from './company-management/company-list/company-item/company-item.component';
import { CompanyManagementComponent } from './company-management/company-management.component';
import { CompanySettingsComponent } from './company-management/company-settings/company-settings.component';
import { CompanyDetailsComponent } from './company-management/company-settings/company-details/company-details.component';
import { UserAccessComponent } from './company-management/company-settings/user-access/user-access.component';
import { UserDetailComponent } from './company-management/company-settings/user-access/user-detail/user-detail.component';
import { CompanySnapshotComponent } from './company-snapshot/company-snapshot.component';
import { LiquidityComponent } from './company-snapshot/liquidity/liquidity.component';
import { ProfitabilityComponent } from './company-snapshot/profitability/profitability.component';
import { PerformanceComponent } from './company-snapshot/performance/performance.component';
import {AppRoutingModule} from './app-routing.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    CompanyListComponent,
    CompanyItemComponent,
    CompanyManagementComponent,
    CompanySettingsComponent,
    CompanyDetailsComponent,
    UserAccessComponent,
    UserDetailComponent,
    CompanySnapshotComponent,
    LiquidityComponent,
    ProfitabilityComponent,
    PerformanceComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    AppRoutingModule,

  ],
  entryComponents: [CompanySnapshotComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
