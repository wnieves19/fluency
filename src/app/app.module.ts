import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {MaterialModule} from './material-module';
import { CompanyListComponent } from './company-management/company-list/company-list.component';
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
import { LoginComponent } from './user-authentication/login/login.component';
import { RegisterComponent } from './user-authentication/register/register.component';
import {AuthService} from './user-authentication/auth.service';
import { UserAuthenticationComponent } from './user-authentication/user-authentication.component';
import {environment} from '../environments/environment';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import {AngularFireAuthModule} from 'angularfire2/auth';
import {ReactiveFormsModule} from '@angular/forms';
import { FormsModule } from '@angular/forms';
import {FlexLayoutModule} from '@angular/flex-layout';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { LiquidityBalanceWidgetComponent } from './company-snapshot/liquidity/liquidity-balance-widget/liquidity-balance-widget.component';
import { LiquidityCashflowChartsComponent } from './company-snapshot/liquidity/liquidity-cashflow-charts/liquidity-cashflow-charts.component';
import { LiquidityCashflowWaterfallComponent } from './company-snapshot/liquidity/liquidity-cashflow-waterfall/liquidity-cashflow-waterfall.component';
import { ChartsModule as KendoChartsModule } from '@progress/kendo-angular-charts';
import 'hammerjs';
import { LiquidityBalanceDialogComponent } from './company-snapshot/liquidity/liquidity-balance-widget/liquidity-balance-dialog/liquidity-balance-dialog.component';
import { UserAccountComponent } from './user-account/user-account.component';
import {CredentialsInterceptorService} from './interceptor';
import {LiquidityService} from './company-snapshot/liquidity/liquidity.service';
import {CompanyService} from './company-management/company.service';
import { CompanyDetailsFormComponent } from './company-management/company-settings/company-details/company-details-form/company-details-form.component';
import { ConfirmDialogComponent } from './company-management/company-settings/confirm-dialog/confirm-dialog.component';
import { AccountClassificationComponent } from './company-management/company-settings/account-classification/account-classification.component';
import { PlclassificationComponent } from './company-management/company-settings/account-classification/plclassification/plclassification.component';
import { BalanceClassificationComponent } from './company-management/company-settings/account-classification/balance-classification/balance-classification.component';
import { PDFExportModule } from '@progress/kendo-angular-pdf-export';
import { IntlModule } from '@progress/kendo-angular-intl';
import { GridModule } from '@progress/kendo-angular-grid';
import { PasswordResetComponent } from './user-authentication/password-reset/password-reset.component';

@NgModule({
  declarations: [
    AppComponent,
    CompanyListComponent,
    CompanyManagementComponent,
    CompanySettingsComponent,
    CompanyDetailsComponent,
    UserAccessComponent,
    UserDetailComponent,
    CompanySnapshotComponent,
    LiquidityComponent,
    ProfitabilityComponent,
    PerformanceComponent,
    LoginComponent,
    RegisterComponent,
    UserAuthenticationComponent,
    LiquidityBalanceWidgetComponent,
    LiquidityCashflowChartsComponent,
    LiquidityCashflowWaterfallComponent,
    LiquidityBalanceDialogComponent,
    UserAccountComponent,
    CompanyDetailsFormComponent,
    ConfirmDialogComponent,
    AccountClassificationComponent,
    PlclassificationComponent,
    BalanceClassificationComponent,
    PasswordResetComponent,

  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase, 'fluencyanalysis'),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,
    AppRoutingModule,
    FlexLayoutModule,
    KendoChartsModule,
    FormsModule,
    IntlModule,
    GridModule,
    PDFExportModule


  ],
  entryComponents: [CompanySnapshotComponent, LiquidityBalanceDialogComponent, UserDetailComponent, ConfirmDialogComponent],
  providers: [AuthService,CompanyService, LiquidityService,{provide: HTTP_INTERCEPTORS, useClass: CredentialsInterceptorService, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
