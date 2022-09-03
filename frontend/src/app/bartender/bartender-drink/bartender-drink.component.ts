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
  private startTime: Date;
  private timer: ReturnType<typeof setInterval>;

  constructor() { }

  ngOnInit(): void {
    // console.log("data.prices: " + this.data.prices)
    this.price = this.twoDecimalFormatter(this.getPrice(0))
    this.slopeSign = this.toSlopeSignText(this.data.slopeSigns[0])
    this.startTime = this.data.times[0]
    this.timer = setInterval(() => this.updateData(), this.data.tickInterval)
    console.log("started timer for " + this.data.name)
  }

  ngOnDestroy(): void {
    clearInterval(this.timer)
    console.log("cleared timer for " + this.data.name)
  }

  private getPrice(idx: number): number {
    return Math.round(this.data.prices[idx] * 2) / 2
  }

  private updateData(): void {
    const idx = Math.floor((Date.now() - this.startTime.getTime()) / this.data.tickInterval)
    //console.log(this.data.prices[idx])
    this.price = this.twoDecimalFormatter(this.getPrice(idx))
    this.slopeSign = this.toSlopeSignText(this.data.slopeSigns[idx])
  }

  toSlopeSignText(slopeSign: number): string {
    if (slopeSign === 0) return "="
    if (slopeSign === 1) return "+"
    if (slopeSign === -1) return "-"
    return "?"
  }

}
