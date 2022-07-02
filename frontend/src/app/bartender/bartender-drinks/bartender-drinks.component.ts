import { Component, OnInit } from '@angular/core';
import { BackendService, BartenderDrinkInfo } from 'src/app/backend.service';

@Component({
  selector: 'bartender-drinks',
  templateUrl: './bartender-drinks.component.html',
  styleUrls: ['./bartender-drinks.component.css']
})
export class BartenderDrinksComponent implements OnInit {
  service: BackendService
  cols = 2
  isLoaded = false

  bartenderDrinkInfos?: BartenderDrinkInfo[]

  constructor(service: BackendService) {
    this.service = service
  }

  ngOnInit(): void {
    this.service.getDataFromBackend()
    this.refresh()
    setInterval(() => this.refresh(), this.service.refreshInterval)
    this.isLoaded = true
  }

  refresh() {
    this.bartenderDrinkInfos = this.service.getBartenderDrinkInfos()
  }

}
