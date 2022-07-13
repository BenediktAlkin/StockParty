import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'customer-stock-prices',
  templateUrl: './stock-prices.component.html',
  styleUrls: ['./stock-prices.component.css']
})
export class StockPricesComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {
    this.createSvg()
  }

  private createSvg(): void {
    const y = [4, 1, 2, 3]
    const x = d3.range(y.length)

    // Compute default domains.
    //const xDomain = d3.extent(data);
    const xDomain = [0, 100];
    const yDomain = [0, 5];

    // Construct scales and axes.
    var xRange = [0, 1080]
    var yRange = [0, 720]
    const xScale = d3.scaleLinear(xDomain, xRange);
    const yScale = d3.scaleLinear(yDomain, yRange);
    //const xAxis = d3.axisBottom(xScale).ticks(width / 80).tickSizeOuter(0);
    //const yAxis = d3.axisLeft(yScale).ticks(height / 40, yFormat);

    // Construct a line generator.
    const line = d3.line()
      .curve(d3.curveLinear)
      .x(i => xScale(x[i[0]])) // TODO not sure why [0] is needed here or if it is correct
      .y(i => yScale(y[i[0]])); // TODO not sure why [0] is needed here or if it is correct


    var width = 500
    var height = 500
    const svg = d3.select("figure#fig")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])


    svg.append("path")
      .attr("fill", "none")
      .attr("stroke", "currentColor")
      .attr("stroke-width", 1.5)
      .attr("stroke-linecap", "round")
      .attr("stroke-linejoin", "round")
      .attr("stroke-opacity", 1)
  }
}
