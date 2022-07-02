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
  isLoaded = false
  showOverlay = false
  private clickedOnSlider = false;
  private timer: any;

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

  refresh() {
    this.bartenderDrinkInfos = this.service.getBartenderDrinkInfos()
  }

  @HostListener('document:click')
  @HostListener('document:mousepressed')
  documentClick() {
    if (!this.clickedOnSlider)
      this.showOverlay = !this.showOverlay
    else
      this.clickedOnSlider = false;

  }
  sliderMouseDown() {
    this.clickedOnSlider = true;
  }

}
