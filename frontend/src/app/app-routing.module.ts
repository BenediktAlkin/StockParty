import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StockPricesComponent } from './customer/stock-prices/stock-prices.component'

const routes: Routes = [
  { path: "stockprices", component: StockPricesComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
