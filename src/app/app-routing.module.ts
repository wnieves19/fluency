import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Routes, RouterModule} from '@angular/router';
import {ProfitabilityComponent} from './company-snapshot/profitability/profitability.component';
import {LiquidityComponent} from './company-snapshot/liquidity/liquidity.component';
import {PerformanceComponent} from './company-snapshot/performance/performance.component';

const appRoutes: Routes = [
  { path: '', component: ProfitabilityComponent},
  { path: 'profitability', component: ProfitabilityComponent},
  { path: 'liquidity', component: LiquidityComponent},
  { path: 'performance', component: PerformanceComponent},
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
