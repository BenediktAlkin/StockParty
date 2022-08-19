import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StockPricesComponent } from './customer/stock-prices/stock-prices.component'
import { StockPricesFullComponent } from './customer/stock-prices-full/stock-prices-full.component'
import { NavigationComponent } from './navigation/navigation.component';

const routes: Routes = [
  { path: "stockprices", component: StockPricesComponent },
  { path: "fullstockprices", component: StockPricesFullComponent },
  { path: "**", component: NavigationComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
