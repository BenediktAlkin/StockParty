import { Injectable } from '@angular/core';

interface DrinkPrices {
  drink: string
  prices: number[]
  roundedPrices: number[]
  expectedPrices: number[]
}
export interface BartenderDrinkInfo {
  drink: string
  price: number
  roundedPrice: number
  expectedPrice: number
  slope: number
}

@Injectable({ providedIn: 'root' })
export class BackendService {
  startTime?: Date
  refreshInterval?: number
  drinkPrices?: DrinkPrices[]

  getDataFromBackend() {
    this.startTime = new Date()
    this.refreshInterval = 1000
    this.drinkPrices = [
      { drink: "Cola Rum", prices: [1.15, 2.05, 3.01, 3.9], roundedPrices: [1.0, 2.0, 3.0, 4.0], expectedPrices: [2.0, 1.0, 3.0, 4.0] },
      { drink: "Wüstenwasser", prices: [1.15, 2.05, 3.01, 3.9], roundedPrices: [1.0, 2.0, 3.0, 4.0], expectedPrices: [2.0, 1.0, 3.0, 4.0] },
      { drink: "Wüstenwasser", prices: [1.15, 2.05, 3.01, 3.9], roundedPrices: [1.0, 2.0, 3.0, 4.0], expectedPrices: [2.0, 1.0, 3.0, 4.0] },
      { drink: "Wüstenwasser", prices: [1.15, 2.05, 3.01, 3.9], roundedPrices: [1.0, 2.0, 3.0, 4.0], expectedPrices: [2.0, 1.0, 3.0, 4.0] },
      { drink: "Cola Rum", prices: [1.15, 2.05, 3.01, 3.9], roundedPrices: [1.0, 2.0, 3.0, 4.0], expectedPrices: [2.0, 1.0, 3.0, 4.0] },
    ]
  }

  getBartenderDrinkInfos(): BartenderDrinkInfo[] {
    if (this.startTime == null)
      return []
    let dateTime = new Date()
    let timestep = Math.floor((dateTime.getTime() - this.startTime!.getTime()) / 1000) % this.drinkPrices![0].prices.length
    return this.drinkPrices!.map(dp => <BartenderDrinkInfo>{
      drink: dp.drink,
      price: dp.prices[timestep],
      roundedPrice: dp.roundedPrices[timestep],
      expectedPrice: dp.expectedPrices[timestep],
      slope: Math.sign(dp.expectedPrices[timestep] - dp.prices[timestep]),
    })
  }
}
