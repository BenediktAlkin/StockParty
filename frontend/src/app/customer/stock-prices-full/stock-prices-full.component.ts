import { Component, OnInit } from '@angular/core';
import { BackendService, StockPriceData } from 'src/app/backend.service';

@Component({
  selector: 'app-stock-prices-full',
  templateUrl: './stock-prices-full.component.html',
  styleUrls: ['./stock-prices-full.component.css']
})
export class StockPricesFullComponent implements OnInit {
  stockPriceDataArray: StockPriceData[] = [];

  constructor(private service: BackendService) { }

  ngOnInit(): void {
    this.service.getData().subscribe(d => this.stockPriceDataArray = d)
  }

}
