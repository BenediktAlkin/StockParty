import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { BackendService, StockPriceData } from 'src/app/backend.service';

@Component({
  selector: 'bartender-drinks',
  templateUrl: './bartender-drinks.component.html',
  styleUrls: ['./bartender-drinks.component.css']
})
export class BartenderDrinksComponent implements OnInit, OnDestroy {
  stockPriceDataArray: StockPriceData[] = [];
  cols = 2
  //columnGap = 5
  primaryFontSize = 90
  showSecondaryText = true
  // secondaryFontSize = 45
  isLoaded = false
  showSettings = false
  private clickedOnClose = false
  private automaticallyCloseSettingsTimer: any

  constructor(private service: BackendService) { }


  ngOnInit(): void {
    this.service.getData().subscribe(d => {
      this.stockPriceDataArray = d
      this.isLoaded = true
    })
  }

  ngOnDestroy(): void {
    // clearInterval(this.timer)
  }

  getColsStyle(): string {
    return `repeat(${this.cols}, 1fr)`
  }

  closeSettings(calledFromInterval: boolean): void {
    console.log("closeSettings")
    this.showSettings = false
    if (this.automaticallyCloseSettingsTimer != null) {
      clearInterval(this.automaticallyCloseSettingsTimer)
      this.automaticallyCloseSettingsTimer = null
    }


    if (!calledFromInterval)
      this.clickedOnClose = true
  }

  @HostListener('document:click')
  @HostListener('document:mousepressed')
  documentClick() {
    console.log("clicked")
    if (this.clickedOnClose)
      this.clickedOnClose = false
    else
      this.showSettings = true

    if (this.automaticallyCloseSettingsTimer != null)
      clearInterval(this.automaticallyCloseSettingsTimer)
    this.automaticallyCloseSettingsTimer = setInterval(() => this.closeSettings(true), 60000)
  }

}
