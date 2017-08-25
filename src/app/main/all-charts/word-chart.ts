import { Component, ElementRef, ViewChild, NgModule, AfterViewInit, ChangeDetectionStrategy, OnInit, Directive,EventEmitter,Input,Output,DoCheck,OnChanges, SimpleChanges, SimpleChange} from "@angular/core";
import * as D3 from 'd3';
import * as d3Scale from "d3-scale";
declare let d3: any;
//var c20b = d3.scale.category20b();
@Component({
    selector: "word-cloud",
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: '<div></div>',
    styles: [' .svg-container{display:inline-block;position:relative;padding-bottom:10px;vertical-align:top;overflow:hidden}.svg-content-responsive{display:inline-block;position:relative;top:10px;left:10px} .legend {border: 1px solid #555555;border-radius: 5px 5px 5px 5px;font-size: 0.8em;padding: 3px;},.bld {font- weight: bold;}']
})
export class wordcloudComponent implements OnChanges, OnInit{
    @Input() frequency_list: any;
    @Input() charWidgetLocation: any;
    private width: number;
    private height: number;
    private color: any;
    @Input() Stats: any = [];
    @Input() chartData: any = [];
    oldStats: any = this.Stats;
    oldchartData: any[] = this.chartData;
    @Input() ID: any;
    @Input() selectedChartName: any;
    @Output()
    childData: EventEmitter<any> = new EventEmitter();
    oldselectedChartName : any =  this.selectedChartName;
    
    private margin = { top: 40, right: 20, bottom: 20, left: 20 };
    sendData(data:any){
        debugger;
        var thisdimension = this.Stats.chartSpecificOptions.chartMapping["dimension"][0]["mapping"]
        var chartWidgetName = this.Stats.chartWidgetName
        let abc: any = {};
        abc["key"] = thisdimension;
        abc["value"] = data;
        abc["chartWidgetName"] = chartWidgetName;
        //this.outgoingData.emit(abc);
        this.childData.emit(abc);
        debugger;
    }
    constructor() {
        this.width = 400 - this.margin.left - this.margin.right;
        this.height = 400 - this.margin.top - this.margin.bottom;
    }
    ngOnChanges(changes: SimpleChanges) {
        console.log("this i want+++++++++++++");
        console.log("chartName"+this.selectedChartName);
        this.ngOnInit();
  }
 /*ngDoCheck(){
        debugger;
        console.log("this i want+++++++++++++");
        if(this.oldselectedChartName !== this.selectedChartName){
            //this.updateChart();
        }
    }*/
    ngOnInit() {
        document.getElementById("draggable"+this.charWidgetLocation).innerHTML = "";
      //  this.width = window.innerWidth - this.margin.left - this.margin.right;
        //this.height = window.innerHeight - this.margin.top - this.margin.bottom;
        var data = this.chartData;//this.Stats.chartSpecificOptions.chartData;//
        console.log('selectedChartName: '+this.selectedChartName)
        var cwLoc = this.charWidgetLocation;
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
       var svg = d3.select("#draggable"+cwLoc) //container class to make it responsive
                     .append("svg")
                   //responsive SVG needs these 2 attributes and no width and height attr
                   .attr("preserveAspectRatio", "xMinYMin meet")
                   .attr("viewBox", "-200 -170 400 400")
                   //class to make it responsive
                   .classed("svg-content-responsive", true); 
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
             that.sendData(d.text);
          });  
          
        svg.append("text")
        .attr("x", "200px" )             
        .attr("y","200px" )
        .attr("text-anchor", "middle")  
        .style("font-size", "30px") 
        .style("text-decoration", "underline")  
        .text("Value vs Date Graph");
      } 
 
    }
    
}
