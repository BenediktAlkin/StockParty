import { Component, Input, OnInit } from '@angular/core';
import { StockPriceData } from 'src/app/backend.service';
import * as d3 from 'd3';

@Component({
  selector: 'customer-stock-price',
  templateUrl: './stock-price.component.html',
  styleUrls: ['./stock-price.component.css']
})
export class StockPriceComponent implements OnInit {
  // plot configuration
  private historyMinutes: number = 60;


  @Input()
  public data: StockPriceData;
  @Input()
  public showFullTrajectory: boolean;
  public idString: string;
  private historyTicks: number;
  private startTime: Date;
  private timer: ReturnType<typeof setInterval>;



  constructor() { }

  ngOnInit(): void {
    console.log("showFullTrajectory: " + this.showFullTrajectory.toString())
    console.log(this.data)
    console.log("id: " + this.data.id.toString())
    console.log("name: " + this.data.name)
    this.idString = `id${this.data.id}`
    this.startTime = this.data.times[0]
    this.historyTicks = this.historyMinutes * 60 * 1000 / this.data.tickInterval
    console.log("tick interval: " + this.data.tickInterval.toString())
    console.log("history minutes: " + this.historyMinutes.toString())
    console.log("history ticks: " + this.historyTicks.toString())

    this.createSvg()
    // NOTE: this is not totally in sync with the real clock 
    // e.g. if tickInterval == 2000 and the interval starts at 00:00:01 while the sim starts at 00:00:00 it will be off by 1 second
    this.timer = setInterval(() => this.createSvg(), this.data.tickInterval)
    console.log("started timer for " + this.data.name)
  }

  ngOnDestroy(): void {
    clearInterval(this.timer)
    console.log("cleared timer for " + this.data.name)
  }

  private createSvg(): void {
    // line styling
    const lineColor = "red"
    const lineWidth = 2.5
    // price range rectangle styling
    const rectOpacityGeneral = 0.2
    const rectOpacityCurrentPrice = 0.8
    const rectColor1 = "#69a3b2"
    const rectColor2 = "#11a311"
    // title styling
    const titleMarginTop = 0
    const titleMarginBot = 15
    const titleFontSize = 60
    const titleFontSize2 = 50
    // axis styling
    let xticksFontSize = 36
    if (this.showFullTrajectory) {
      xticksFontSize = 24
    }
    const yticksFontSize = 36
    const yticksFontSizeSelected = 42


    // width/height are only relevant for aspect ratio
    const width = 600
    const height = 550
    // create/recreate svg
    const figures = d3.selectAll("figure")
    const figure = figures.filter((_, i) => i === this.data.id)
    const figureChilds = figure.selectAll("*")
    figureChilds.remove()
    const svg = figure
      .append("svg")
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto;")
      .attr("border", "1px solid black");
    // draw border around svg
    svg.append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("stroke-width", 1)
      .attr("fill", "transparent")
      .attr("stroke", "black");


    const marginTop = titleMarginTop + titleFontSize + titleMarginBot
    const marginRight = 0
    const marginBottom = 40
    const marginLeft = 120
    const xRange = [marginLeft, width - marginRight]
    const yRange = [height - marginBottom, marginTop]

    // compute which data to show
    let x = this.data.times
    let y = this.data.prices
    if (this.showFullTrajectory) {
      var partyStart = new Date(this.startTime.getFullYear(), this.startTime.getMonth(), this.startTime.getDate(), 20, 30)
      var partyEnd = new Date(this.startTime.getFullYear(), this.startTime.getMonth(), this.startTime.getDate(), 3, 0)
      partyEnd.setDate(partyEnd.getDate() + 1)
      const maxIdx = (partyEnd.getTime() - this.startTime.getTime()) / this.data.tickInterval
      const minIdx = (partyStart.getTime() - this.startTime.getTime()) / this.data.tickInterval
      x = this.data.times.slice(minIdx, maxIdx)
      y = this.data.prices.slice(minIdx, maxIdx)
    }
    else {
      const maxIdx = (Date.now() - this.startTime.getTime()) / this.data.tickInterval
      const minIdx = Math.max(0, maxIdx - this.historyTicks)
      x = this.data.times.slice(minIdx, maxIdx)
      y = this.data.prices.slice(minIdx, maxIdx)
    }

    //console.log(y)

    // Compute domains.
    const xDomain = d3.extent(x) as [Date, Date];
    const yDomain = [1.75, 4.75];

    // Construct scales and axes.
    const yTicks = 6;
    const xScale = d3.scaleTime().domain(xDomain).range(xRange);
    const yScale = d3.scaleLinear(yDomain, yRange);
    const timeFormatter = d3.timeFormat("%H:%M")
    const xTicks = this.showFullTrajectory ? d3.timeHour.every(1) : d3.timeMinute.every(15)
    const xAxis = d3.axisBottom(xScale).tickFormat(d => timeFormatter(d as Date)).ticks(xTicks);
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
        .attr("opacity", i => Math.abs(y[y.length - 1] - (i as number)) < 0.25 ? rectOpacityCurrentPrice : rectOpacityGeneral))
      // increase font size of yticks and make current price bold
      .call(g => g.selectAll("text")
        .attr("font-size", i => Math.abs(y[y.length - 1] - (i as number)) < 0.25 ? `${yticksFontSizeSelected}px` : `${yticksFontSize}px`)
        .attr("font-weight", i => Math.abs(y[y.length - 1] - (i as number)) < 0.25 ? "bold" : "normal"));
    // remove bar of y-axis
    //.call(g => g.select(".domain").remove()) 
    // draw horizontal grid lines (at exact price points)
    // .call(g => g.selectAll(".tick line").clone()
    //     .attr("x2", width - marginLeft - marginRight)
    //     .attr("stroke-opacity", 0.2));


    // Construct a line generator.
    const I = d3.range(x.length);
    const line = d3.line<number>()
      .curve(d3.curveLinear)
      .x(i => xScale(x[i]))
      .y(i => yScale(y[i]));
    // draw price line
    svg.append("path")
      .attr("fill", "none")
      .attr("stroke", lineColor)
      .attr("stroke-width", lineWidth)
      .attr("stroke-linecap", "round")
      .attr("stroke-linejoin", "round")
      .attr("stroke-opacity", 1)
      .attr("d", line(I));

    // add title
    const price = Math.round(y[y.length - 1] * 2) / 2
    svg.append("text")
      // center w.r.t plot
      //.attr("x", marginLeft / 2 + width / 2)
      // center w.r.t svg
      .attr("x", width / 2)
      .attr("y", titleMarginTop + titleFontSize)
      .attr("text-anchor", "middle")
      .attr("font-weight", "bold")
      .style("font-size", this.data.name.length > 16 ? `${titleFontSize2}px` : `${titleFontSize}px`)
      .text(`${this.data.name} ${twoDecimalFormatter(price)}€`);
  }
}
