import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StockPricesComponent } from './customer/stock-prices/stock-prices.component'
import { StockPricesFullComponent } from './customer/stock-prices-full/stock-prices-full.component'
import { NavigationComponent } from './navigation/navigation.component';
import { BartenderDrinksComponent } from './bartender/bartender-drinks/bartender-drinks.component';

const routes: Routes = [
  { path: "stockprices", component: StockPricesComponent },
  { path: "topsecret", component: StockPricesFullComponent },
  { path: "bartender", component: BartenderDrinksComponent },
  { path: "**", component: NavigationComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
