import { PropertyRead } from '@angular/compiler';
import { Component, Input, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'customer-stock-price',
  templateUrl: './stock-price.component.html',
  styleUrls: ['./stock-price.component.css']
})
export class StockPriceComponent implements OnInit {
  @Input()
  public id: number = -1;
  public idString: string = "";
  @Input()
  public name: string = "";
  @Input()
  public x: Date[] = [];
  @Input()
  public y: number[] = [];


  constructor() {
  }

  ngOnInit(): void {
    this.idString = `id${this.id}`
    // console.log(this.id)
    // console.log(this.name)
    // console.log(this.x)
    // console.log(this.y)
    this.createSvg()
    setInterval(() => this.createSvg(), 1000)
  }

  private createSvg(): void {
    //console.log(this)
    //console.log("tick")
    // line styling
    const lineColor = "red"
    // price range rectangle styling
    const rectOpacityGeneral = 0.2
    const rectOpacityCurrentPrice = 0.8
    const rectColor1 = "#69a3b2"
    const rectColor2 = "#11a311"
    // title styling
    const titleMarginTop = 0
    const titleFontSize = 36
    // axis styling
    const xticksFontSize = 16
    const yticksFontSize = 24


    const width = 600
    const height = 400
    //const figure = d3.select(`#${this.idString}`)
    const figures = d3.selectAll("figure")
    // console.log(figures)
    const figure = figures.filter((_, i) => i === this.id)
    // console.log(figure)
    const figureChilds = figure.selectAll("*")
    // console.log(figureChilds)
    figureChilds.remove()
    const svg = figure
      .append("svg")
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto;");
    //.attr("style", "width: 100%; height: 100%;");


    const marginTop = titleMarginTop + titleFontSize + 5
    const marginRight = 0
    const marginBottom = 30
    const marginLeft = 80
    const xRange = [marginLeft, width - marginRight]
    const yRange = [height - marginBottom, marginTop]


    // Compute domains.
    const xDomain = d3.extent(this.x) as [Date, Date];
    const yDomain = [1.25, 4.75];

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
        .attr("opacity", i => Math.abs(this.y[this.y.length - 1] - (i as number)) < 0.25 ? rectOpacityCurrentPrice : rectOpacityGeneral))
      // increase font size of yticks and make current price bold
      .call(g => g.selectAll("text")
        .attr("font-size", `${yticksFontSize}px`)
        .attr("font-weight", i => Math.abs(this.y[this.y.length - 1] - (i as number)) < 0.25 ? "bold" : "normal"));
    // remove bar of y-axis
    //.call(g => g.select(".domain").remove()) 
    // draw horizontal grid lines (at exact price points)
    // .call(g => g.selectAll(".tick line").clone()
    //     .attr("x2", width - marginLeft - marginRight)
    //     .attr("stroke-opacity", 0.2));


    // Construct a line generator.
    const I = d3.range(this.x.length);
    const line = d3.line<number>()
      .curve(d3.curveLinear)
      .x(i => xScale(this.x[i]))
      .y(i => yScale(this.y[i]));
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
    const price = Math.round(this.y[this.y.length - 1] * 2) / 2
    svg.append("text")
      .attr("x", (width / 2))
      .attr("y", titleMarginTop + titleFontSize)
      .attr("text-anchor", "middle")
      .style("font-size", `${titleFontSize}px`)
      .text(`${this.name} ${twoDecimalFormatter(price)}€`);
  }
}
