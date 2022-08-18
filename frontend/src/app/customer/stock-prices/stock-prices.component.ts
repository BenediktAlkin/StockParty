import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'customer-stock-prices',
  templateUrl: './stock-prices.component.html',
  styleUrls: ['./stock-prices.component.css']
})
export class StockPricesComponent {
  stockPriceDataArray = [
    { id: 1, name: "Cola Rum", x: [2, 2, 3, 4] },
    { id: 2, name: "Wüstenwasser", x: [4, 3.5, 2, 4] },
    { id: 3, name: "Vodka Bull", x: [3, 3, 2, 3.5] },
    { id: 4, name: "Cappy Vodka", x: [3.5, 2, 3, 4] },
  ]
  stockPriceDates = [
    new Date(Date.now() + (30 * 60 * 1000)),
    new Date(Date.now() + (60 * 60 * 1000)),
    new Date(Date.now() + (90 * 60 * 1000)),
    new Date(Date.now() + (120 * 60 * 1000)),
  ]
}
