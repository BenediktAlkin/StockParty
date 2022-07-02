import { Injectable } from '@angular/core';

interface DrinkPrices {
  drink: string
  prices: number[]
}
export interface BartenderDrinkInfo {
  drink: string
  price: number
}

@Injectable({
  providedIn: 'root'
})

export class BackendService {
  startTime?: Date
  refreshInterval?: number
  drinkPrices?: DrinkPrices[]

  getDataFromBackend() {
    this.startTime = new Date()
    this.refreshInterval = 1000
    this.drinkPrices = [
      { drink: "Cola Rum", prices: [1, 2, 3, 4] },
      { drink: "Wüstenwasser", prices: [4, 3, 2, 1] },
      { drink: "Wüstenwasser", prices: [4, 3, 2, 1] },
      { drink: "Wüstenwasser", prices: [4, 3, 2, 1] },
      { drink: "Wüstenwasser", prices: [4, 3, 2, 1] },
      { drink: "Wüstenwasser", prices: [4, 3, 2, 1] },
    ]
  }

  getBartenderDrinkInfos(): BartenderDrinkInfo[] {
    if (this.startTime == null)
      return []
    let dateTime = new Date()
    let timestep = Math.floor((dateTime.getTime() - this.startTime!.getTime()) / 1000) % this.drinkPrices![0].prices.length
    return this.drinkPrices!.map(dp => <BartenderDrinkInfo>{ drink: dp.drink, price: dp.prices[timestep] })
  }
}
