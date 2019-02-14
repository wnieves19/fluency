import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Routes, RouterModule} from '@angular/router';
import {ProfitabilityComponent} from './company-snapshot/profitability/profitability.component';
import {LiquidityComponent} from './company-snapshot/liquidity/liquidity.component';
import {PerformanceComponent} from './company-snapshot/performance/performance.component';
import {UserAuthenticationComponent} from './user-authentication/user-authentication.component';
import {CompanySnapshotComponent} from './company-snapshot/company-snapshot.component';
import {LoginComponent} from './user-authentication/login/login.component';
import {AppComponent} from './app.component';
import {AuthGuardService} from './user-authentication/auth-guard.service';
import {CompanySettingsComponent} from './company-management/company-settings/company-settings.component';
import {UserAccountComponent} from './user-account/user-account.component';

const appRoutes: Routes = [
  { path: '', component: AppComponent},
  { path: 'user-authentication', component: UserAuthenticationComponent},
  { path: 'company-snapshot',canActivate: [AuthGuardService], component: CompanySnapshotComponent,  children: [
      {path: '', component: LiquidityComponent},
      { path: 'liquidity', component: LiquidityComponent},
      { path: 'profitability', component: ProfitabilityComponent},
      { path: 'performance', component: PerformanceComponent},
      { path: 'settings', component: CompanySettingsComponent},
      { path: 'account-details', component: UserAccountComponent},
    ]},
  { path: 'login', component: LoginComponent},

  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(appRoutes)
  ],
  declarations: [],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
