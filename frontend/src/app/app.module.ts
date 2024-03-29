import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';

import { FormsModule } from '@angular/forms';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSliderModule } from '@angular/material/slider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon'
import { MatSlideToggleModule } from '@angular/material/slide-toggle';



import { BartenderDrinksComponent } from './bartender/bartender-drinks/bartender-drinks.component';
import { StockPricesComponent } from './customer/stock-prices/stock-prices.component';
import { StockPriceComponent } from './customer/stock-price/stock-price.component';
import { StockPricesFullComponent } from './customer/stock-prices-full/stock-prices-full.component';
import { NavigationComponent } from './navigation/navigation.component';
import { BartenderDrinkComponent } from './bartender/bartender-drink/bartender-drink.component';


@NgModule({
  declarations: [
    AppComponent,
    BartenderDrinksComponent,
    StockPricesComponent,
    StockPriceComponent,
    StockPricesFullComponent,
    NavigationComponent,
    BartenderDrinkComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    MatGridListModule,
    MatSliderModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatSlideToggleModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
