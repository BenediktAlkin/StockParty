import { Component, Input, OnInit } from '@angular/core';
import { StockPriceData } from 'src/app/backend.service';
import * as d3 from 'd3';

@Component({
  selector: 'bartender-drink',
  templateUrl: './bartender-drink.component.html',
  styleUrls: ['./bartender-drink.component.css']
})
export class BartenderDrinkComponent implements OnInit {
  @Input()
  public data: StockPriceData;
  @Input()
  public primaryFontSize: number;
  // @Input()
  // public secondaryFontSize: number;
  @Input()
  public showSecondaryText: boolean;

  public price: string;
  public slopeSign: string;
  private twoDecimalFormatter = d3.format(".2f")

  constructor() { }

  ngOnInit(): void {
    this.price = this.twoDecimalFormatter(this.data.prices[0])
    this.slopeSign = this.toSlopeSignText(this.data.slopeSigns[0])
  }

  toSlopeSignText(slopeSign: number): string {
    if (slopeSign === 0) return "="
    if (slopeSign === 1) return "+"
    if (slopeSign === -1) return "+"
    return "?"
  }

}
