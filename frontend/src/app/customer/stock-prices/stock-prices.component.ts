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
    //setInterval(this.createSvg, 1000)
  }

  private createSvg(): void {
    // line styling
    const lineColor = "red"
    // price range rectangle styling
    const rectOpacityGeneral = 0.2
    const rectOpacityCurrentPrice = 0.8
    const rectColor1 = "#69a3b2"
    const rectColor2 = "#11a311"
    // title styling
    const titleMarginTop = 20
    const titleFontSize = 36
    // axis styling
    const xticksFontSize = 16
    const yticksFontSize = 24


    const width = 600
    const height = 400
    const figure = d3.select("figure")
    const svg = figure
      .append("svg")
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 33%; height: auto;");


    const marginTop = titleMarginTop + titleFontSize + 5
    const marginRight = 30
    const marginBottom = 30
    const marginLeft = 80
    const xRange = [marginLeft, width - marginRight]
    const yRange = [height - marginBottom, marginTop]

    const X = [
      new Date(Date.now() + (30 * 60 * 1000)),
      new Date(Date.now() + (60 * 60 * 1000)),
      new Date(Date.now() + (90 * 60 * 1000)),
      new Date(Date.now() + (120 * 60 * 1000)),
      new Date(Date.now() + (150 * 60 * 1000)),
    ];
    const Y = [2.5, 2, 3, 4, 3.5];

    // Compute domains.
    let xDomain = d3.extent(X) as [Date, Date];
    let yDomain = [1.25, 4.75];

    // Construct scales and axes.
    const yTicks = 7;
    const xScale = d3.scaleTime().domain(xDomain).range(xRange);
    const yScale = d3.scaleLinear(yDomain, yRange);
    const timeFormatter = d3.timeFormat("%H:%M")
    const xAxis = d3.axisBottom(xScale).tickFormat(d => timeFormatter(d as Date)).ticks(d3.timeMinute.every(15));
    const twoDecimalFormatter = d3.format(".2f")
    const yAxis = d3.axisLeft(yScale).ticks(yTicks).tickFormat(t => `${twoDecimalFormatter(t)}€`);

    // x axis
    svg.append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(xAxis)
      // increase font size of xticks
      .call(g => g.selectAll("text").attr("font-size", `${xticksFontSize}px`));

    // y axis
    const rectHeight = (height - marginTop - marginBottom) / yTicks;
    svg.append("g")
      // make some space for y-axis
      .attr("transform", `translate(${marginLeft},0)`)
      .call(yAxis)
      // draw rectangles that indicate closest price point
      .call(g => g.selectAll(".tick")
        .append("rect")
        .attr("x", 0.5) // 0.5 is the offset for not overlapping with the yaxis bar
        .attr("width", width - marginLeft - marginRight)
        .attr("y", -rectHeight / 2)
        .attr("height", rectHeight)
        .attr("fill", i => (i as number) % 1 == 0 ? rectColor1 : rectColor2)
        .attr("opacity", i => Math.abs(Y[Y.length - 1] - (i as number)) < 0.25 ? rectOpacityCurrentPrice : rectOpacityGeneral))
      // increase font size of yticks and make current price bold
      .call(g => g.selectAll("text")
        .attr("font-size", `${yticksFontSize}px`)
        .attr("font-weight", i => Math.abs(Y[Y.length - 1] - (i as number)) < 0.25 ? "bold" : "normal"));
    // remove bar of y-axis
    //.call(g => g.select(".domain").remove()) 
    // draw horizontal grid lines (at exact price points)
    // .call(g => g.selectAll(".tick line").clone()
    //     .attr("x2", width - marginLeft - marginRight)
    //     .attr("stroke-opacity", 0.2));


    // Construct a line generator.
    const I = d3.range(X.length);
    const line = d3.line<number>()
      .curve(d3.curveLinear)
      .x(i => xScale(X[i]))
      .y(i => yScale(Y[i]));
    // draw price line
    svg.append("path")
      .attr("fill", "none")
      .attr("stroke", lineColor)
      .attr("stroke-width", 1.5)
      .attr("stroke-linecap", "round")
      .attr("stroke-linejoin", "round")
      .attr("stroke-opacity", 1)
      .attr("d", line(I));

    // add title
    svg.append("text")
      .attr("x", (width / 2))
      .attr("y", titleMarginTop + titleFontSize)
      .attr("text-anchor", "middle")
      .style("font-size", `${titleFontSize}px`)
      .text("Value vs Date Graph");
  }
}
