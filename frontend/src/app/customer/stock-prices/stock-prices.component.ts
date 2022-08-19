import { Component, OnInit } from '@angular/core';
import { BackendService, StockPriceData } from 'src/app/backend.service';

@Component({
  selector: 'customer-stock-prices',
  templateUrl: './stock-prices.component.html',
  styleUrls: ['./stock-prices.component.css']
})
export class StockPricesComponent implements OnInit {
  stockPriceDataArray: StockPriceData[] = [];
  // stockPriceDataArray = [
  //   { id: 0, name: "Cola Rum", x: [2, 2, 3, 4] },
  //   { id: 1, name: "Wüstenwasser", x: [4, 3.5, 2, 4] },
  //   { id: 2, name: "Vodka Bull", x: [3, 3, 2, 3.5] },
  //   { id: 3, name: "Cappy Vodka", x: [3.5, 2, 3, 4] },
  //   { id: 4, name: "Cola Rum", x: [2, 2, 3, 4] },
  //   { id: 5, name: "Wüstenwasser", x: [4, 3.5, 2, 4] },
  //   { id: 6, name: "Vodka Bull", x: [3, 3, 2, 3.5] },
  //   { id: 7, name: "Cappy Vodka", x: [3.5, 2, 3, 4] },
  // ]
  // stockPriceDates = [
  //   new Date(Date.now() + (30 * 60 * 1000)),
  //   new Date(Date.now() + (60 * 60 * 1000)),
  //   new Date(Date.now() + (90 * 60 * 1000)),
  //   new Date(Date.now() + (120 * 60 * 1000)),
  // ]

  constructor(private service: BackendService) { }


  ngOnInit(): void {
    this.service.getData().subscribe(d => this.stockPriceDataArray = d)
  }

}
