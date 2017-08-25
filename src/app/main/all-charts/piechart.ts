import { Component, OnInit, Input } from '@angular/core';
import { GSDatasetDto, GSAnalysisChart, PieChartOptions, AnalysisDto, TempBaseUrl } from '@shared/service-proxies/ids-service-proxies'

import * as d3 from 'd3-selection';
import * as d3Scale from "d3-scale";
import * as d3Shape from "d3-shape";

@Component({
    selector: 'pie-chart11',
    template: `
    <svg width="100%" height="100%"></svg>
  `
})
export class piechartComponent12 implements OnInit {
    @Input() gsDataset: GSDatasetDto;
    @Input() gsAnalysis: AnalysisDto;
    @Input() finalChart: GSAnalysisChart;
    @Input() chartData: any = [];
    private margin = { top: 20, right: 20, bottom: 30, left: 50 };
    private width: number;
    private height: number;
    private radius: number;

    private arc: any;
    private labelArc: any;
    private pie: any;
    private color: any;
    private svg: any;
    @Input() Stats: Pie[] = [];

    constructor() {
        this.width = 250 - this.margin.left - this.margin.right;
        this.height = 250 - this.margin.top - this.margin.bottom;
        this.radius = Math.min(this.width, this.height) / 2;

        let f: Pie = { label: "Category", measure: 20 };
        this.Stats.push(f);
        f = { label: "Category", measure: 20 };
        this.Stats.push(f);
        f = { label: "Category", measure: 20 };
        this.Stats.push(f);
        f = { label: "Category", measure: 20 };
        this.Stats.push(f);
        f = { label: "Category", measure: 20 };
        this.Stats.push(f);
        f = { label: "Category", measure: 20 };
        this.Stats.push(f);
    }

    ngOnInit() {
        //if (this.finalChart !== undefined) {
        //    let pie: PieChartOptions = this.finalChart.chartSpecificOptions;
        //    for (let p of pie.chartData) {
        //        let f: Pie = { label: p.label, measure: +p.measure };
        //        this.Stats.push(f);
        //    }
        //}
        this.initSvg()
        this.drawPie();
    }

    private initSvg() {

        this.color = d3Scale.scaleOrdinal()
            .range(["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac"]);
        this.arc = d3Shape.arc()
            .outerRadius(this.radius)
            .innerRadius(0);
        this.labelArc = d3Shape.arc()
            .outerRadius(this.radius - 100)
            .innerRadius(this.radius - 100);
        this.pie = d3Shape.pie()
            .sort(null)
            .value((d: any) => d.measure);
        this.svg = d3.select("svg")
            .append("g")
            .attr("transform", "translate(" + (this.width / 3 + this.margin.left) + "," + (this.height / 2.5 + this.margin.top) + ")")     /*"translate(" + this.width / 2 + "," + this.height / 2 + ")"*/
            .style("stroke-width", "5px");
    }

    private drawPie() {
        let g = this.svg.selectAll(".arc")
            .data(this.pie(this.Stats))
            .enter().append("g")
            .attr("class", "arc");
        var arcs = this.svg.selectAll("g.slice")
            .data(this.pie(this.Stats))
            .enter().append("g")
            .attr("class", "slice")

        g.append("path").attr("d", this.arc)
            .style("fill", (d: any) => this.color(d.data.label))
            //.attr("d", function (d) {
            //    // log the result of the arc generator to show how cool it is :)
            //    console.log(this.arc(d));
            //    return this.arc(d);
            //})
            .on("mouseover", function (d) {
                d3.select(this)
                    .attr("stroke", "white")
                this.Pie.transition().duration(500)
                    .attr("fillOpacity", 2)
                    .attr("d", arcs)
                //.style("stroke-width", "5px");
            })

            .on("mouseout", function (d) {
                d3.select(this)
                    .attr("stroke", "none")
                this.pie.transition().remove()
                    .attr("fillOpacity", 0)
                    .attr("d", arcs)
                    .attr("stroke-width", 0);

                //var padding = 20,
                //    legx = this.radius + padding,
                //    legend = this.svg.append("g")
                //        .attr("class", "legend")
                //        .attr("transform", "translate(" + legx + ", 0)")
                //        .style("font-size", "12px")
                //        .call(d3.legend);
            });

        g.append("text").attr("transform", (d: any) => "translate(" + this.labelArc.centroid(d) + ")")
            .attr("dy", "0.2em")
            .text((d: any) => d.data.label + " " + d.data.measure + "%");
        //g.append("text").attr("transform", (d: any) => "translate(" + this.labelArc.outerRadius(d) + ")")
        //    .attr("dy", "0.2em")
        //    .text((d: any) => d.data.label);

        this.pie.append("text").attr("transform", (d: any) => "translate(" + this.labelArc.outerRadius(d) + ")")
            .attr("dx", "0.2em")
            .text((d: any) => d.data.label);



    }

}
interface Pie {
    label: string;
    measure: number;
}
