import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface StockPriceData {
  id: number
  name: string
  tickInterval: number
  prices: number[]
  slopeSigns: number[]
  times: Date[]
}

@Injectable({ providedIn: 'root' })
export class BackendService {

  constructor(private http: HttpClient) { }

  getData(): Observable<StockPriceData[]> {
    return this.http.get<StockPriceData[]>("/api/get_data")
      .pipe(
        map(data => {
          for (let i = 0; i < data.length; i++)
            data[i].times = data[i].times.map(t => new Date(t))
          return data
        })
      )
  }
}
