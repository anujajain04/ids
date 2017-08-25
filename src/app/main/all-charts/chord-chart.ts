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
    selector: 'chord-chart',
    template:  '<div></div>'
    
})
export class chordDiagramComponent {

    //@Input() data: any;
    @Input() Stats: any;
    @Input() charWidgetLocation:any;
    @Input() chartData: any = [];
    matrix: any;
    

    private Names :any;
   // private Names = ["insurance", "india", "nayaprotection", "hoarding", "icici", "termcover", "walk", "past", "pedestrian", "icicibank", "bank", "shaktiarora", "badalte", "payment", "card"];

    private width: number;
    private height: number;
    private margin = { top: 20, right: 20, bottom: 30, left: 40 };
    private innerRadius: number;
    private outerRadius: number;
    private svg: any;
    private chord: any;
    private fill: any;
    private range: any;
    private color: any;
    private wrapper: any;
    private opacityDefault: any;
    private arc: any;
    private path: any;
    private g: any;
    private chords: any;
    constructor() {
    }
    ngOnInit() {
        debugger;
        if (this.Stats) {
//            this.matrix = this.Stats.matrix;
//            this.Names = this.Stats.label;
        }
        ////this.matrix = [
        ////[47, 45, 46, 46, 46, 46, 0, 0, 0, 46, 0, 45, 46, 0, 0], [45, 47, 45, 45, 47, 45, 0, 0, 0, 45, 1, 44, 45, 0, 0],
        ////[46, 45, 46, 46, 46, 46, 0, 0, 0, 46, 0, 45, 46, 0, 0], [46, 45, 46, 46, 46, 46, 0, 0, 0, 46, 0, 45, 46, 0, 0],
        ////[46, 47, 46, 46, 109, 46, 7, 7, 7, 49, 33, 45, 46, 8, 10], [46, 45, 46, 46, 46, 46, 0, 0, 0, 46, 0, 45, 46, 0, 0],
        ////[0, 0, 0, 0, 7, 0, 7, 7, 7, 0, 7, 0, 0, 0, 0], [0, 0, 0, 0, 7, 0, 7, 7, 7, 0, 7, 0, 0, 0, 0],
        ////[0, 0, 0, 0, 7, 0, 7, 7, 7, 0, 7, 0, 0, 0, 0], [46, 45, 46, 46, 49, 46, 0, 0, 0, 49, 0, 45, 46, 0, 0],
        ////[0, 1, 0, 0, 33, 0, 7, 7, 7, 0, 34, 0, 0, 5, 7], [45, 44, 45, 45, 45, 45, 0, 0, 0, 45, 0, 45, 45, 0, 0],
        ////[46, 45, 46, 46, 46, 46, 0, 0, 0, 46, 0, 45, 46, 0, 0], [0, 0, 0, 0, 8, 0, 0, 0, 0, 0, 5, 0, 0, 8, 1],
        ////[0, 0, 0, 0, 10, 0, 0, 0, 0, 0, 7, 0, 0, 1, 10]];
        this.width = 960 - this.margin.left - this.margin.right;
        this.height = 600 - this.margin.top - this.margin.bottom;
        this.initSvg();
    }
    private initSvg() {
        
     var color = d3.scale.category20();           
     var data = this.Stats.chartData;
     var cwLoc = this.charWidgetLocation;
    this.outerRadius = Math.min(this.width, this.height) / 2 - 10,
    this.innerRadius = this.outerRadius - 24;
    
//    
//    
//    var formatPercent = d3.format("d");
//    
//    var arc = d3.svg.arc()
//        .innerRadius(this.innerRadius)
//        .outerRadius(this.outerRadius);
//    
//    var layout = d3.layout.chord()
//        .padding(.04)
//        .sortSubgroups(d3.descending)
//        .sortChords(d3.ascending);
//    
//    var path = d3.svg.chord()
//        .radius(this.innerRadius);
//    
//    var svg = d3.select("#draggable"+cwLoc).append("svg").classed("svgclass", true).attr("id",'chordchart').attr("preserveAspectRatio", "xMinYMin meet");
//   
//     //svg.attr("viewBox", (width/-2)*2+" "+((width/-2)+25)+" "+ (width*2) +" "+heightparent*1.2);
//    // svg.attr("viewBox", (width/-2)*2+" "+((width/-2)+25)+" "+ (width*2) +" "+((width*2)-60));
//    svg.attr("id", "circle")
//    svg.append("circle")
//        .attr("r", this.outerRadius);
//    layout.matrix(matrix);
//
//    // Add a group per neighborhood.
//    var group = svg.selectAll(".group")
//    .data(layout.groups)
//      .enter().append("g")
//        .attr("class", "group")
//        .on("mouseover", mouseover);
//
//    // Add a mouseover title.
//    group.append("title").text(function(d, i) {
//      return label[i] + ": " + formatPercent(d.value);
//    });
//    
//    
//    group.append("text")
//      .each(function(d) { d.angle = (d.startAngle + d.endAngle) / 2; })
//      .attr("dy", ".35em")
//      .attr("transform", function(d) {
//        return "rotate(" + (d.angle * 180/ Math.PI - 90 ) + ")"
//            + "translate(" + (this.innerRadius + 30) + ")"
//            + (d.angle > Math.PI ? "rotate(180)" : "");
//      })
//      .style("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
//       .style("font-size","12px")
//      .text(function(d, i) { return label[i] });
//    
//    
//    var groupPath = group.append("path")
//    .attr("id", function(d, i) { return "group_"+i; })
//    .attr("d", arc)
//    .style("fill", function(d, i) { return color([i]); });
//    
//    
//    // Add a text label.
//    var groupText = groupPath.append("text")
//        .attr("x", 6)
//        .attr("dy", 15)
//        .append("textPath")
//        .attr("xlink:href", function(d, i) { return "#group_"+i; })
//        .text(function(d, i) {
//            console.log("Label +"+label[i]);
//            return label[i] });
//
//    // Remove the labels that don't fit. :(
//    groupText.filter(function(d, i) { return groupPath[0][i].getTotalLength() / 2 - 16 < this.getComputedTextLength(); })
//        .remove();
//    
//    
//    
//
//    // Add the chords.
//    var chord = svg.selectAll(".chord")
//        .data(layout.chords)
//      .enter().append("path")
//        .attr("class", "chord")
//        .style("fill", function(d) { return color([d.source.index]); })
//        .attr("d", path);
//
//    // Add an elaborate mouseover title for each chod.
//    chord.append("title").text(function(d) {
//      return label[d.source.index]
//          + " → " + label[d.target.index]
//          + ": " + formatPercent(d.source.value)
//          + "\n" + label[d.target.index]
//          + " → " + label[d.source.index]
//          + ": " + formatPercent(d.target.value);
//    });
//
//    function mouseover(d, i) {
//      chord.classed("fade", function(p) {
//        return p.source.index != i
//            && p.target.index != i;
//      });
//    }
//    
//     svg.append("text")
//     .attr("class", "title")
//     .attr("x",this.width-300)
//     .attr("y",this.height-this.height/2)
//     .attr("text-anchor", "middle");
//    
}
        
 }       
        

//        this.color = d3.scale.category20();
//        this.svg = d3.select("#draggable" + this.charWidgetLocation).append("svg")
//            .attr("width", (this.width + this.margin.left + this.margin.right))
//            .attr("height", (this.height + this.margin.top + this.margin.bottom));
//
//        this.wrapper = this.svg.append("g").attr("class", "chordWrapper")
//            .attr("transform", "translate(" + (this.width / 3 + this.margin.left) + "," + (this.height / 2 + this.margin.top) + ")");
//
//        this.outerRadius = Math.min(this.width, this.height) / 2 - 100,
//            this.innerRadius = this.outerRadius * 0.95,
//            this.opacityDefault = 0.7;
//
//        this.chord = d3.layout.chord()
//            .padding(.02)
//            .sortSubgroups(d3.descending) //sort the chords inside an arc from high to low
//            .sortChords(d3.descending) //which chord should be shown on top when chords cross. Now the biggest chord is at the bottom
//            .matrix(this.matrix);
//
//        this.arc = d3.svg.arc()
//            .innerRadius(this.innerRadius)
//            .outerRadius(this.outerRadius);
//
//        this.path = d3.svg.chord()
//            .radius(this.innerRadius);
//
//        this.fill = d3.scale.ordinal()
//            .domain(d3.range(this.Names.length))
//            .range(["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac"]);
//
//        this.g = this.wrapper.selectAll("g.group")
//            .data(this.chord.groups)
//            .enter().append("g")
//            .attr("class", "group");
//        debugger;
//        this.g.append("path")
//            .style("stroke", (d: any) => this.color(d.index))
//            .style("fill", (d: any) => this.color(d.index))
//            .attr("d", this.arc)
//            .on('mouseover', (data) => {
//                this.fade(0, data);
//            })
//            .on('mouseout', (data) => {
//                this.fade(1, data);
//            });
//
//        this.g.append("text")
//            .each((d: any) => d.angle = ((d.startAngle + d.endAngle) / 2))
//            .attr("dy", ".35em")
//            .attr("class", "titles")
//            .attr("text-anchor", (d: any) => d.angle > Math.PI ? "end" : null)
//            .attr("transform", (d: any) => "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
//                + "translate(" + (this.innerRadius + 20) + ")"
//                + (d.angle > Math.PI ? "rotate(180)" : ""))
//            .text((d: any) => this.Names[d.index]);
//
//
//        this.chords = this.wrapper.selectAll("path.chord")
//            .data(this.chord.chords)
//            .enter().append("path")
//            .attr("class", "chord")
//            .style("stroke", "none")
//            .style("fill", (d: any) => this.color(d.target.index))
//            .style("opacity", 1)
//            .attr("d", this.path);
//        // .on("mouseover", (data) => { this.fadeChord(0.05,0.05,data); }) 
//        //   .on("mouseout", (data) => { this.fadeChord(1,0.9,data) });
//
//        this.g.append("title")
//            .text((d: any) => Math.round(d.value) + " people in " + this.Names[d.index]);
//
//        this.chords.append("title")
//            .text(
//            (d: any) => Math.round(d.source.value) + " people from " + this.Names[d.target.index] + " to " + this.Names[d.source.index]
//            );
//
//    }
//
//    fade(opacity, visibility) {
//        //alert(JSON.stringify(visibility))
//        this.chords
//            .filter((d: any) => d.source.index != visibility.index && d.target.index != visibility.index
//            )
//            .transition()
//            .style("opacity", opacity);
//    }
//
//    fadeChord(opacityArcs, opacityChords, visibility) {
//
//        this.chords
//            .filter((d: any, j: any) => j != visibility.source.subindex)//j!=visibility.source.subindex || j!= visibility.target.index)
//            .transition()
//            .style("opacity", opacityChords);
//
//    }
//}
