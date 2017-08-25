import { Component, OnInit, Input } from '@angular/core';
import * as d3selection from 'd3-selection';
import * as d3Scale from "d3-scale";
import * as d3Array from "d3-array";
import * as d3Axis from "d3-axis";
import * as d3Format from "d3-format";
import * as d3Chord from "d3-chord";
import * as d3Shape from "d3-shape";
import * as d3Ribbon from "d3-chord";
import * as D3 from 'd3';
declare let d3: any;

@Component({
    selector: 'bar-chart',
    template: '<div></div>',
    styles: ['.svg-container{display:inline-block;position:relative;width:100%;padding-bottom:100%;vertical-align:top;overflow:hidden}.svg-content-responsive{display:inline-block;position:absolute;top:10px;left:0} body {font- family: "Helvetica Neue", Helvetica, Arial, sans-serif;width: 960px;height: 500px;position: relative;} polyline{opacity: .3;stroke: black;stroke-width: 2px;fill: none;} rect{stroke-width:2} svg {width: 100 %;height: 100 %;position: center;}.toolTip {font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;position: absolute;display: none; width: auto;height: auto;background: none repeat scroll 0 0 white;border: 0 none;border-radius: 8px 8px 8px 8px;box-shadow: -3px 3px 15px #888888;color: black; font: 12px sans-serif; padding:5px; text-align:center;}text {font:10px sans-serif; color: white; }text.value {font-size:120 %;fill:white;}.axisHorizontal path{fill: none; }.axisHorizontal.tick line {stroke-width:1; stroke:rgba(0, 0, 0, 0.2);}.bar {fill:steelblue; fill-opacity:.9;}']
})
export class barChartComponent {

    //@Input() data: any;
    private margin = { top: 20, right: 30, bottom: 30, left: 30 };
    private width: number;
    private height: number;
    private svg: any;
    @Input() Stats: any;
    @Input() charWidgetLocation:any;
    @Input() chartData: any = [];
    private Names: any;
    private color: any;
    private g: any;

    constructor() {
        
        this.width = 360 - this.margin.left - this.margin.right;
        this.height = 360 - this.margin.top - this.margin.bottom;
    }
        
        
        
     ngOnInit() 
    {
        debugger;
        var data = this.Stats.chartData;
        var cwLoc = this.charWidgetLocation;
        // set the ranges
        var x = d3.scale.ordinal().rangeRoundBands([0, this.width], .05);
        
        var y = d3.scale.linear().range([this.height, 0]);
        
        // define the axis
        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom")
        
        
        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .ticks(10);
        
        
        // add the SVG element
        var svg = d3.select("#draggable" + cwLoc)
        .append("svg")
           //responsive SVG needs these 2 attributes and no width and height attr
           .attr("preserveAspectRatio", "xMinYMin meet")
           .attr("viewBox", "0 0 600 400")
           //class to make it responsive
           .classed("svg-content-responsive", true)
          .append("g")
            .attr("transform", 
                  "translate(" + this.margin.left + "," + this.margin.top + ")");
        
       
            var data_1 = this.Stats.chartData;
       
       

      
            
          // scale the range of the data
          x.domain(data.map(function(d) { return d.label; }));
          y.domain([0, d3.max(data, function(d) { return d.measure; })]);
        
          // add axis
          svg.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + this.height + ")")
              .call(xAxis)
            .selectAll("text")
              .style("text-anchor", "end")
              .attr("dx", "-.8em")
              .attr("dy", "-.55em")
              .attr("transform", "rotate(-90)" );
        
          svg.append("g")
              .attr("class", "y axis")
              .call(yAxis)
            .append("text")
              .attr("transform", "rotate(-90)")
              .attr("y", 5)
              .attr("dy", ".71em")
              .style("text-anchor", "end")
              .text("Frequency");
        
        
          // Add bar chart
          svg.selectAll("bar")
              .data(data)
            .enter().append("rect")
              .attr("class", "bar")
              .attr("x", function(d) { return x(d.data.label); })
              .attr("width", x.rangeBand())
              .attr("y", function(d) { return y(d.measure); })
              .attr("height", function(d) { return this.height - y(d.data.measure); });
        
       
         svg.append("text")
        .attr("x", (this.width / 2))             
        .attr("y", 0 - (this.margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .style("text-decoration", "underline")  
        .text("Value vs Date Graph");
     
    }

//    private initSvg() {
//
//        data = [
//            { label: "Category 1", value: 19 },
//            { label: "Category 2", value: 5 },
//            { label: "Category 3", value: 13 },
//            { label: "Category 4", value: 17 },
//            { label: "Category 5", value: 19 },
//            { label: "Category 6", value: 27 }
//        ];
//
//
//        var div = d3.select("svg").append("g").attr("class", "toolTip");
//
//        var axisMargin = 20,
//            margin = 80,
//            valueMargin = 4,
//            width = parseInt(d3.select("svg").style('width'), 10),
//            height = parseInt(d3.select("svg").style('height'), 10),
//            barHeight = (height - axisMargin - margin * 2) * 0.4 / data.length,
//            barPadding = (height - axisMargin - margin * 2) * 0.6 / data.length,
//            data, bar, svg, scale, xAxis, labelWidth = 0;
//
//        var max = d3.max(data, function (d) { return d.value; });
//
//        svg = d3.select("svg")
//            .append("g")
//            .attr("width", width)
//            .attr("height", height);
//
//
//        bar = svg.selectAll("g")
//            .data(data)
//            .enter()
//            .append("g");
//
//        bar.attr("class", "bar")
//            .attr("cx", 0)
//            .attr("transform", function (d, i) {
//                return "translate(" + margin + "," + (i * (barHeight + barPadding) + barPadding) + ")";
//            });
//
//        bar.append("text")
//            .attr("class", "label")
//            .attr("y", barHeight / 2)
//            .attr("dy", ".35em") //vertical align middle
//            .text(function (d) {
//                return d.label;
//            }).each(function () {
//                labelWidth = Math.ceil(Math.max(labelWidth, this.getBBox().width));
//            });
//
//        scale = d3.scale.linear()
//            .domain([0, max])
//            .range([0, width - margin * 2 - labelWidth]);
//
//        xAxis = d3.svg.axis()
//            .scale(scale)
//            .tickSize(-height + 2 * margin + axisMargin)
//            .orient("bottom");
//
//        bar.append("rect")
//            .attr("transform", "translate(" + labelWidth + ", 0)")
//            .attr("height", barHeight)
//            .attr("width", function (d) {
//                return scale(d.value);
//            });
//
//        bar.append("text")
//            .attr("class", "value")
//            .attr("y", barHeight / 2)
//            .attr("dx", -valueMargin + labelWidth) //margin right
//            .attr("dy", ".35em") //vertical align middle
//            .attr("text-anchor", "end")
//            .text(function (d) {
//                return (d.value + "%");
//            })
//            .attr("x", function (d) {
//                var width = this.getBBox().width;
//                return Math.max(width + valueMargin, scale(d.value));
//            });
//        debugger;
//        bar
//            .on("mousemove", function (d) {
//                div.style("left", d3.event.pageX + 10 + "px");
//                div.style("top", d3.event.pageY - 25 + "px");
//                div.style("display", "inline-block");
//                div.html((d.label) + "<br>" + (d.value) + "%");
//            });
//        bar
//            .on("mouseout", function (d) {
//                div.style("display", "none");
//            });
//
//        svg.insert("g", ":first-child")
//            .attr("class", "axisHorizontal")
//            .attr("transform", "translate(" + (margin + labelWidth) + "," + (height - axisMargin - margin) + ")")
//            .call(xAxis);
//
//        bar.append("title")
//            .text(function (d) {
//                return d.letter;
//            });
//    }
}