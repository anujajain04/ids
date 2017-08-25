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
    template: `
                <div></div>
            `,
    //styles: ['body {font: 10px sans-serif;}.axis path,.axis line {fill: none;stroke: #000;shape-rendering: crispEdges;}.bar {fill: orange;}.bar:hover {fill: orangered ;}.x.axis path {display: none;}.d3-tip {line-height: 1;font-weight: bold;padding: 12px;background: rgba(0, 0, 0, 0.8);color: #fff;border-radius: 2px;}']
})
export class NewbarChartComponent {
    private width: number;
    private height: number;
    private margin = { top: 20, right: 20, bottom: 30, left: 40 };
    private innerRadius: number;
    private outerRadius: number;
    private svg: any;
    private color: any;
    private g: any;
    
    constructor() {
    }
    ngOnInit() {
        debugger;
       

        //this.width = 960 - this.margin.left - this.margin.right;
        //this.height = 600 - this.margin.top - this.margin.bottom;
        this.initSvg();
    }
    private initSvg() {
        var data = [
            { "letter": "A", "frequency": 0.08167 },
            { "letter": "B", "frequency": 0.01492 },
            { "letter": "C", "frequency": 0.02780 },
            { "letter": "D", "frequency": 0.04253 },
            { "letter": "E", "frequency": 0.12702 },
            { "letter": "F", "frequency": 0.02288 },
            { "letter": "G", "frequency": 0.02022 },
            { "letter": "H", "frequency": 0.06094 },
            { "letter": "I", "frequency": 0.06973 },
            { "letter": "J", "frequency": 0.00153 },
            { "letter": "K", "frequency": 0.00747 },
            { "letter": "L", "frequency": 0.04025 },
            { "letter": "M", "frequency": 0.02517 },
            { "letter": "N", "frequency": 0.06749 },
            { "letter": "O", "frequency": 0.07507 },
            { "letter": "P", "frequency": 0.01929 },
            { "letter": "Q", "frequency": 0.00098 },
            { "letter": "R", "frequency": 0.05987 },
            { "letter": "S", "frequency": 0.06333 },
            { "letter": "T", "frequency": 0.09056 },
            { "letter": "U", "frequency": 0.02758 },
            { "letter": "V", "frequency": 0.01037 },
            { "letter": "W", "frequency": 0.02465 },
            { "letter": "X", "frequency": 0.00150 },
            { "letter": "Y", "frequency": 0.01971 },
            { "letter": "Z", "frequency": 0.00074 }
        ]

        var margin = { top: 40, right: 20, bottom: 30, left: 40 },
            width = 960 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        var formatPercent = d3.format(".0%");

        var x = d3.scale.ordinal()
            .rangeRoundBands([0, width], .1);

        var y = d3.scale.linear()
            .range([height, 0]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .tickFormat(formatPercent);

        var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function (d) {
                return "<strong>Frequency:</strong> <span style='color:red'>" + d.frequency + "</span>";
            })

        var svg = d3.select("#barchart").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        svg.call(tip);

       

        //d3.tsv("data.tsv", type, function(error, data) {
        x.domain(data.map(function (d) { return d.letter; }));
        y.domain([0, d3.max(data, function (d) { return d.frequency; })]);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Frequency");

        svg.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function (d) { return x(d.letter); })
            .attr("width", x.rangeBand())
            .attr("y", function (d) { return y(d.frequency); })
            .attr("height", function (d) { return height - y(d.frequency); })
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide)

        //});

        function type(d) {
            d.frequency = +d.frequency;
            return d;
        }
    }


}
