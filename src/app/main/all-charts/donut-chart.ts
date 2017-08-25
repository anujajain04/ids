import { Component, OnInit, Input,Output, OnChanges, SimpleChanges, EventEmitter} from '@angular/core';
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
   selector: 'donut-chart',
    template: '<div></div>',
    styles: [' .svg-container{display:inline-block;position:relative;width:100%;padding-bottom:100%;vertical-align:top;overflow:hidden}.svg-content-responsive{display:inline-block;position:absolute;top:10px;left:0} .legend {border: 1px solid #555555;']
    })
    
export class donutChartComponent  implements OnChanges{

    private margin = { top: 20, right: 20, bottom: 30, left: 40 };
    private width: number;
    private height: number;
    private radius: number;
   
    private arc: any;
    private labelArc: any;
    private outerRadius: any;
    private pie: any;
    private color: any;
    private svg1: any;
    @Input() Stats: any;
    @Input() charWidgetLocation:any;
    @Input() chartData: any = [];
    @Output()
    donutChildData: EventEmitter<any> = new EventEmitter();
    
    sendData(data:any){
        debugger;
        var thisdimension = this.Stats.chartSpecificOptions.chartMapping["dimension"][0]["mapping"]
        var chartWidgetName = this.Stats.chartWidgetName
        let abc: any = {};
        abc["key"] = thisdimension;
        abc["value"] = data;
        abc["chartWidgetName"] = chartWidgetName;
        //this.outgoingData.emit(abc);
        this.donutChildData.emit(abc);
        debugger;
    }

    constructor() {
        this.width = 360 - this.margin.left - this.margin.right;
        this.height = 360 - this.margin.top - this.margin.bottom;
        this.radius = Math.min(this.width, this.height) / 2.5;

  }
    ngOnChanges(changes: SimpleChanges) {
        console.log("donut");
        debugger;
        this.ngOnInit();
    }        

    ngOnInit() {
   
       var that = this;
        debugger;
        document.getElementById("draggable"+this.charWidgetLocation).innerHTML = "";
        //this.chartTitle = 
        this.color = d3Scale.scaleOrdinal()
            .range(["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac"]);
        this.arc = d3Shape.arc()
            .outerRadius(this.radius)
            .innerRadius(100);
        this.labelArc = d3Shape.arc()
            .outerRadius(this.radius - 100)
            .innerRadius(this.radius - 100);
        this.pie = d3Shape.pie()
            .sort(null)
            .value((d: any) => d.measure);
  debugger;     
            this.svg1 = d3.select("#draggable"+this.charWidgetLocation)
                .append("svg")
                    //responsive SVG needs these 2 attributes and no width and height attr
                   .attr("preserveAspectRatio", "xMinYMin meet")
                   .attr("viewBox", "-50 -50 400 400")
                   //class to make it responsive
                   .classed("svg-content-responsive", true)
                .append("g")
                .attr("transform", "translate(" + (this.width / 3 + this.margin.left) + "," + (this.height / 2.5 + this.margin.top) + ")")     /*"translate(" + this.width / 2 + "," + this.height / 2 + ")"*/
                .style("stroke-width", "5px");
       
            /*if (this.Stats.chartSpecificOptions.chartData !== undefined) {
                var data_1 = this.Stats.chartSpecificOptions.chartData;
            }
            else {
                var data_1 = this.Stats;
            }*/
        if(this.chartData!==undefined){
             var data_1 = this.chartData;
        }
        else{
            var data_1 = this.chartData;
        }
        
        let g = this.svg1.selectAll(".arc")
            .data(this.pie(data_1))
            .enter().append("g")
            .attr("class", "arc");
        var arcs = this.svg1.selectAll("g.slice")
            .data(this.pie(data_1))
            .enter().append("g")
            .attr("class", "slice")

        g.append("path").attr("d", this.arc)
            .style("fill", (d: any) => this.color(d.data.label))
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
              }).on("click", function (d, i){
                   that.sendData(d.text);
              }); 
               
    
        
         this.svg1.append("text")
         .attr("x",0 + this.margin.right )             
        .attr("y", "150px")
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .style("text-decoration", "underline")  
        .text("Value vs Date Graph");

  
}
    
    }
