import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { BackendService, BartenderDrinkInfo } from 'src/app/backend.service';

@Component({
  selector: 'bartender-drinks',
  templateUrl: './bartender-drinks.component.html',
  styleUrls: ['./bartender-drinks.component.css']
})
export class BartenderDrinksComponent implements OnInit, OnDestroy {
  service: BackendService
  cols = 2
  columnGap = 5
  primaryFontSize = 90
  showSecondaryText = true
  secondaryFontSize = 45
  isLoaded = false
  showSettings = false
  private clickedOnClose = false
  private automaticallyCloseSettingsTimer: any

  bartenderDrinkInfos?: BartenderDrinkInfo[]

  constructor(service: BackendService) {
    this.service = service
  }

  ngOnInit(): void {
    this.service.getDataFromBackend()
    this.refresh()
    // this.timer = setInterval(() => this.refresh(), this.service.refreshInterval)
    this.isLoaded = true
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
    clearInterval(this.automaticallyCloseSettingsTimer)
    this.automaticallyCloseSettingsTimer = null

    if (!calledFromInterval)
      this.clickedOnClose = true
  }

  refresh() {
    this.bartenderDrinkInfos = this.service.getBartenderDrinkInfos()
  }

  @HostListener('document:click')
  documentClick() {
    console.log("clicked")
    if (this.clickedOnClose)
      this.clickedOnClose = false
    else
      this.showSettings = true
    this.automaticallyCloseSettingsTimer = setInterval(() => this.closeSettings(true), 60000)

  }

}
