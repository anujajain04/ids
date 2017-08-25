import { Component, ElementRef, ViewChild, AfterViewInit, OnInit, Directive,EventEmitter,Input,Output } from "@angular/core";
import { DashboardService, DashboardDto, DeletedashboardDto, DashboardStudioConfig, CreateDashBoardDto, ChartWidgets, LocalFilter, LocalFiltersChart } from '@shared/service-proxies/ids-dashboard-service-proxies';
import * as D3 from 'd3';
import * as d3Scale from "d3-scale";
import * as d3selection from 'd3-selection';

import * as d3Array from "d3-array";
import * as d3Axis from "d3-axis";
import * as d3Format from "d3-format";
import * as d3Chord from "d3-chord";
import * as d3Shape from "d3-shape";
import * as d3Ribbon from "d3-chord";

declare let d3: any;

//var c20b = d3.scale.category20b();
@Component({
    selector: "chart-root1",
    template: '<div  class="col-sm-5 ttlconfigdivlayout" id="wordCloud"></div><div  class="col-sm-5 ttlconfigdivlayout" id="pieChart"></div>',
    styles: ['#pieChart{position:relative;height:80%;min-height:80% border:1px solid black;margin: 40px;} #wordCloud{margin: 40px;position:relative;height:80%;min-height:80% border:1px solid black;} .svg-container{display:inline-block;position:relative;padding-bottom:10px;vertical-align:top;overflow:hidden}.svg-content-responsive{display:inline-block;position:relative;top:10px;left:10px} .legend {border: 1px solid #555555;border-radius: 5px 5px 5px 5px;font-size: 0.8em;padding: 3px;},.bld {font- weight: bold;}']
})
export class chartRootComponent implements OnInit {
    @Input() dashboardData: any;
    private margin = { top: 10, right: 10, bottom: 10, left:10 };
    private width: number;
    private height: number;
    private color: any;
    private radius: number;
    private arc: any;
    private labelArc: any;
    private outerRadius: any;
    private pie: any;
    private svg: any;
    
    constructor(private dashboardService:DashboardService) {
       this.width = 400;
       this.height = 400;
    }
    ngOnInit() {
        
     let dashboardData =  this.dashboardData;    
     this.renderChart(dashboardData);
     
    }
    renderChart(dashboardData){
      debugger;
     //let dashboardData =  this.dashboardData; 
    for (let chart of dashboardData){
           if(chart.chartSpecificOptions.chartVisualizationType=="Word Cloud")
             {this.initWordCloud(chart)}
          else if(chart.chartSpecificOptions.chartVisualizationType=="Pie Chart")
             { this.initPieChart(chart); }
        }  
    
    }
    
    initWordCloud(chartData:any){
    
      debugger;
       document.getElementById("wordCloud").innerHTML = "";
       this.width = 400 ;
       this.height = 400; 
        //window.innerWidth - this.margin.left - this.margin.right;
       // this.height = window.innerHeight - this.margin.top - this.margin.bottom;
        var data = chartData.chartSpecificOptions.chartData;
        
        var fill = d3.scale.category20();
        var that = this;  
   
   
     d3.layout.cloud().size([this.width, this.height])
        .words(data.map(function(d) {
            console.log(d.word +"size"+d.size); return {text:d.word, size:d.size};
          }))
          .rotate(function() { return 0;})
          .font("Impact")
          .fontSize(function(d) { return d.size/2 })
          .on("end", draw)
          .start(); 
         
      function draw(words) {
       var svg = d3.select("#wordCloud") //container class to make it responsive
                   .append("svg")
                   //responsive SVG needs these 2 attributes and no width and height attr
                   .attr("preserveAspectRatio", "xMinYMin meet")
                   .attr("viewBox", "-200 -200 400 400")
                   //class to make it responsive
                   .classed("svg-content-responsive", true); 
          //.append("svg")  //container class to make it responsive
//                  
//                     .attr('width', "100%")
//                     .attr('height',"100%");
//                   //responsive SVG needs these 2 attributes and no width and height attr
                  
    
          svg.append("g")
            //svg.attr("transform", "translate("+ width/2+","+height/2+")")
          .selectAll("text")
            .data(words)
          .enter().append("text")
            .style("font-size", function(d) { return d.size + "px"; })
            .style("font-family", "Impact")
            .style("fill", function(d, i) { return fill(i); })
            .attr("text-anchor", "middle")
            .attr("transform", function(d) {
              return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .text(function(d) { return d.text; })
               .on("click", function (d, i){
         
           that.FilterData("wordCloud" ,"Sentiment", d.text)
                   
      });
          
          
      }



    }

    
    
    initPieChart(chartData:any){
      this.width = 400 - this.margin.left - this.margin.right;
        this.height = 400 - this.margin.top - this.margin.bottom;
        this.radius = Math.min(this.width, this.height) / 3;    
     debugger;
     document.getElementById("pieChart").innerHTML = "";
       debugger;
       
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
            this.svg = d3.select("#pieChart")
                .append("svg")
                    //responsive SVG needs these 2 attributes and no width and height attr
                 
                   //responsive SVG needs these 2 attributes and no width and height attr
                   .attr("preserveAspectRatio", "xMinYMin meet")
                   .attr("viewBox", "-70 -20 400 400")
                   //class to make it responsive
                   .classed("svg-content-responsive", true)
                // .attr('width', "100%")
                 // .attr('height',"100%") 
//                .attr("preserveAspectRatio", "xMinYMin meet")
//                   .attr("viewBox", "-50 -50 400 400")
//                   //class to make it responsive
//                   .classed("svg-content-responsive", true)
                .append("g")
                .attr("transform", "translate(" + (this.width / 3 + this.margin.left) + "," + (this.height / 2.5 + this.margin.top) + ")")     /*"translate(" + this.width / 2 + "," + this.height / 2 + ")"*/
                .style("stroke-width", "5px");
       
//            if (this.Stats.chartData !== undefined) {
//                var data_1 = this.Stats.chartData;
//            }
//            else {
//                var data_1 = this.Stats;
//            }
         var data_1 = chartData.chartSpecificOptions.chartData;
        let g = this.svg.selectAll(".arc")
            .data(this.pie(data_1))
            .enter().append("g")
            .attr("class", "arc");
        var arcs = this.svg.selectAll("g.slice")
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
              
                 
    });
          


    }
    updatePieChart(chartData:any){
    

    }

    FilterData(fromChart:any ,dimension:string,datavalue:string ){
    debugger;
    var demoDashboardDataJSON = {"DashboardDetails":{"entityType":"Dashboard","dashboardTitle":"Umesh Twitter Dataset2Dashboard","entityName":"Umesh Twitter Dataset2Dashboard","chartWidgets":[{"gridStackWidth":"","chartPositionTop":"","chartWidgetName":"Twitter Analysis111Chart","gridStackHeight":"","chartWidgetWidth":"","chartSpecificOptions":{"pieChartLabel":"Sentiment","pieChartLabelFontColour":"","pieChartTitle":"","datasetKey":"8b79d964-fe80-4150-8754-e78ac22a25c9","chartData":[{"measure":"12","label":"Negative"},{"measure":"59","label":"Neutral"},{"measure":"20","label":"Positive"}],"chartVisualizationType":"Pie Chart","subDatasetKey":"48550bb8-2a61-4478-a990-e7266bc950ba","pieChartLegendFlag":"","pieChartWidth":"","ChartVariable":[{"type":"dimension","variableName":"dimension"},{"type":"measure","variableName":"measure"}],"pieChartLabelFontType":"","AnalysisDatasetFlag":"","AnalysisKey":"","pieChartHeight":"","pieChartRadius":"","ChartMapping":{"measures":[{"mapping":"tweet","aggregation":"Count","variableName":"measure"}],"dimension":[{"legendRule":{"legendFlag":"","legendName":"","legendFont":"","rule":"","legendColour":""},"mapping":"Sentiment","variableName":"dimension"}]},"pieChartLabelFontSize":""},"chartWidgetTitle":"Twitter Analysis111Chart","chartPositionLeft":"","chartWidgetIdentifier":"","chartType":"default","chartWidgetHeight":""},{"gridStackWidth":"","chartPositionTop":"","chartWidgetName":"Umesh Twitter Frequency AnalysisChart","gridStackHeight":"","chartWidgetWidth":"","chartSpecificOptions":{"wordCloudChartLabelFontColour":"","wordCloudChartTitle":"","wordCloudChartLabelFontSize":"","datasetKey":"8b79d964-fe80-4150-8754-e78ac22a25c9","chartData":[{"word":"yesbank","size":"40"},{"word":"tell","size":"40"},{"word":"that","size":"40"},{"word":"advertis","size":"41"},{"word":"call","size":"41"},{"word":"care","size":"41"},{"word":"insur","size":"41"},{"word":"past","size":"41"},{"word":"branch","size":"41"},{"word":"dscjpmile","size":"41"},{"word":"earn","size":"41"},{"word":"easiest","size":"41"},{"word":"jetairway","size":"41"},{"word":"jpmile","size":"41"},{"word":"upgrad","size":"41"},{"word":"use","size":"41"},{"word":"way","size":"41"},{"word":"digit","size":"42"},{"word":"flywithsid","size":"42"},{"word":"credit","size":"44"},{"word":"card","size":"45"},{"word":"icicibankcar","size":"50"},{"word":"icicibank","size":"51"},{"word":"bank","size":"59"},{"word":"icici","size":"90"}],"chartVisualizationType":"Word Cloud","subDatasetKey":"ec0a2ad4-5452-481d-a9de-d37e8ada36d0","ChartVariable":[{"type":"dimension","variableName":"text"},{"type":"measure","variableName":"size"},{"type":"measure","variableName":"colour"},{"type":"dimension","variableName":"text"},{"type":"measure","variableName":"measure"},{"type":"dimension","variableName":"xAxis"},{"type":"measure","variableName":"yAxis"}],"AnalysisDatasetFlag":"","AnalysisKey":"","wordCloudChartLabelFontType":"","ChartMapping":{"measures":[{"mapping":"Frequency","aggregation":"None","variableName":"size"}],"dimension":[{"legendRule":{"legendFlag":"","legendName":"","legendFont":"","rule":"","legendColour":""},"mapping":"Word","variableName":"text"}]},"wordCloudChartRotation":""},"chartWidgetTitle":"Umesh Twitter Frequency AnalysisChart","chartPositionLeft":"","chartWidgetIdentifier":"","chartType":"default","chartWidgetHeight":""}],"entityKey":"9b2841a1-a352-4f13-b8e2-48d8c5c9f638","chartAssociationMatrix":{"Umesh Twitter Frequency Analysis1Chart":["null","null","Word","null"],"Umesh Twitter Analysis SentimentChart":["null","null","null","Sentiment"],"Twitter Analysis cococ3Chart":["Text2","Text1","null","null"],"Umesh Twitter Frequency AnalysisChart":["null","null","Word","null"],"Twitter correlation By UmeshChart":["Text2","Text1","null","null"],"confirmedDim":["Text2","Text1","Word","Sentiment"],"Twitter Analysis111Chart":["null","null","null","Sentiment"],"Twitter Analysis cococ2Chart":["Text2","Text1","null","null"]},"entityDescription":"Default Dashboard For Umesh Twitter Dataset2","dashboardType":"default","parentKey":"6ab6344c-a5f0-4a70-864d-6d37c1d6d7b7"},"statusMessage":"Dashboard retrieved","statusCode":1}
     this.renderChart(demoDashboardDataJSON.DashboardDetails.chartWidgets)
     var localFilter={"mappedDimension":dimension,"dataValue":datavalue}   
     this.dashboardService.filterLocal(localFilter).subscribe(result => {
                debugger;
                //abp.ui.clearBusy();
                let data = result;
                debugger;
        });  
        //Call to Dashboard Service API , Get Data ,Call to update**** 
   // renderChart(dashboardData);

    }
    





   
}