import { Component, Input, OnInit } from '@angular/core';
import { StockPriceData } from 'src/app/backend.service';

@Component({
  selector: 'bartender-drink',
  templateUrl: './bartender-drink.component.html',
  styleUrls: ['./bartender-drink.component.css']
})
export class BartenderDrinkComponent implements OnInit {
  @Input()
  public data: StockPriceData;

  constructor() { }

  ngOnInit(): void {
  }

}
