import { Component, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Router, ActivatedRoute } from '@angular/router';
import { Stats } from '../getting-started/shared/data';
import { TempBaseUrl, LoadingService } from '@shared/service-proxies/ids-service-proxies';
import { DashboardService, DashboardDto } from '@shared/service-proxies/ids-dashboard-service-proxies';
import * as d3selection from 'd3-selection';
import * as d3Scale from "d3-scale";
import * as d3Array from "d3-array";
import * as d3Axis from "d3-axis";
import * as d3Format from "d3-format";
import * as d3Chord from "d3-chord";
import * as d3Shape from "d3-shape";
import * as d3Ribbon from "d3-chord";
import * as D3 from 'd3';
declare var $: any;
declare let d3: any;


@Component({
    templateUrl: './create-dashboard.component.html',
    animations: [appModuleAnimation()]
})
export class CreateDashboardComponent {





    private matrix = [
        [47, 45, 46, 46, 46, 46, 0, 0, 0, 46, 0, 45, 46, 0, 0], [45, 47, 45, 45, 47, 45, 0, 0, 0, 45, 1, 44, 45, 0, 0],
        [46, 45, 46, 46, 46, 46, 0, 0, 0, 46, 0, 45, 46, 0, 0], [46, 45, 46, 46, 46, 46, 0, 0, 0, 46, 0, 45, 46, 0, 0],
        [46, 47, 46, 46, 109, 46, 7, 7, 7, 49, 33, 45, 46, 8, 10], [46, 45, 46, 46, 46, 46, 0, 0, 0, 46, 0, 45, 46, 0, 0],
        [0, 0, 0, 0, 7, 0, 7, 7, 7, 0, 7, 0, 0, 0, 0], [0, 0, 0, 0, 7, 0, 7, 7, 7, 0, 7, 0, 0, 0, 0],
        [0, 0, 0, 0, 7, 0, 7, 7, 7, 0, 7, 0, 0, 0, 0], [46, 45, 46, 46, 49, 46, 0, 0, 0, 49, 0, 45, 46, 0, 0],
        [0, 1, 0, 0, 33, 0, 7, 7, 7, 0, 34, 0, 0, 5, 7], [45, 44, 45, 45, 45, 45, 0, 0, 0, 45, 0, 45, 45, 0, 0],
        [46, 45, 46, 46, 46, 46, 0, 0, 0, 46, 0, 45, 46, 0, 0], [0, 0, 0, 0, 8, 0, 0, 0, 0, 0, 5, 0, 0, 8, 1],
        [0, 0, 0, 0, 10, 0, 0, 0, 0, 0, 7, 0, 0, 1, 10]];

    private Names = ["insurance", "india", "nayaprotection", "hoarding", "icici", "termcover", "walk", "past", "pedestrian", "icicibank", "bank", "shaktiarora", "badalte", "payment", "card"];

    private width: number;
    private height: number;
    private margin = { top: 0, right: 0, bottom: 0, left: 0 };
    private innerRadius: number;
    private outerRadius: number;
    private svg: any;
    private chord: any;
    private chords: any;
    private fill: any;
    private range: any;
    private color: any;
    private wrapper: any;
    private opacityDefault: any;
    private arc: any;
    private path: any;
    private g: any;

    private pieMargin = { top: 0, right: 0, bottom: 0, left: 0 };
    private pieWidth: number;
    private pieHeight: number;
    private radius: number;
    private pieArc: any;
    private labelArc: any;
    private pie: any;
    private pieColor: any;
    private pieSvg: any;

    constructor(private _router: Router, private _load: LoadingService, private dService: DashboardService) {

    }
    ngOnInit() {

        $(function () {
            // settings
            var minWidth = 15;
            var splitterWidth = 2;  // this should match the css value

            var splitter = $('.ui-resizable-e');
            var container = $('.wrap');
            var boxes = $('.resizable');

            var subBoxWidth = 0;
            $(".resizable:not(:last)").resizable({
                autoHide: false,
                handles: 'e',
                minWidth: minWidth,

                start: function (event, ui) {
                    // We will take/give width from/to the next element; leaving all other divs alone.
                    subBoxWidth = ui.element.width() + ui.element.next().width();
                    // set maximum width
                    ui.element.resizable({
                        maxWidth: subBoxWidth - splitterWidth - minWidth
                    });
                },

                resize: function (e, ui) {
                    var index = $('.wrap').index(ui.element);
                    ui.element.next().width(
                        subBoxWidth - ui.element.width()
                    );
                },

            });
        });



        this.width = 300 - this.margin.left - this.margin.right;
        this.height = 300 - this.margin.top - this.margin.bottom;

        this.pieWidth = 300 - this.pieMargin.left - this.pieMargin.right;
        this.pieHeight = 300 - this.pieMargin.top - this.pieMargin.bottom;
        this.radius = Math.min(this.pieWidth, this.pieHeight) / 3;
        //this.getDashboardList();

        this.initSvg();
        this.initPie()
        this.drawPie();

    }
    //private getDashboardList() {
    //    const _content = JSON.stringify({
    //        workspaceKey: TempBaseUrl.WORKSPACEKEY
    //    });
    //    this._load.start();
    //    this.dService.getSidePane1(_content).subscribe(res => {
    //        this._load.stop();
    //        debugger;
    //        let count = 1;
    //        var view = $(".sidenav");
    //        view.empty();
    //        console.log(view);
    //        for (let r of res) {
    //            if (r instanceof DashboardDto) {
    //                $("<div class='custmdashmenu'><a href='#'>Step " + count + " : " + r.dashboardTitle + "</a></div>").appendTo(view);
    //                count++;
    //            }
    //        }
    //    });
    //}
    private initSvg() {

        this.color = d3.scale.category20();
        this.svg = d3.select("#chart").append("svg")
            .attr("width", (this.width + this.margin.left + this.margin.right))
            .attr("height", (this.height + this.margin.top + this.margin.bottom));

        this.wrapper = this.svg.append("g").attr("class", "chordWrapper")
            .attr("transform", "translate(" + (this.width / 2 + this.margin.left) + "," + (this.height / 2.5 + this.margin.top) + ")");

        this.outerRadius = Math.min(this.width, this.height) / 2 - 50,
            this.innerRadius = this.outerRadius * 0.95,
            this.opacityDefault = 0.7;

        this.chord = d3.layout.chord()
            .padding(.02)
            .sortSubgroups(d3.descending) //sort the chords inside an arc from high to low
            .sortChords(d3.descending) //which chord should be shown on top when chords cross. Now the biggest chord is at the bottom
            .matrix(this.matrix);

        this.arc = d3.svg.arc()
            .innerRadius(this.innerRadius)
            .outerRadius(this.outerRadius);

        this.path = d3.svg.chord()
            .radius(this.innerRadius);

        this.fill = d3.scale.ordinal()
            .domain(d3.range(this.Names.length))
            .range(["#C4C4C4", "#C4C4C4", "#C4C4C4", "#EDC951", "#CC333F", "#00A0B0"]);

        this.g = this.wrapper.selectAll("g.group")
            .data(this.chord.groups)
            .enter().append("g")
            .attr("class", "group");
        debugger;
        this.g.append("path")
            .style("stroke", (d: any) => this.color(d.index))
            .style("fill", (d: any) => this.color(d.index))
            .attr("d", this.arc)
            .on('mouseover', (data) => {
                this.fade(0, data);
            })
            .on('mouseout', (data) => {
                this.fade(1, data);
            });




        $("#draggable").draggable({ cursor: "move", cursorAt: { top: 6, left: 6 } });
        $(".draggable2").draggable({ cursor: "move", cursorAt: { top: 6, left: 6 } });
        // this.g.append("text")
        //   .each((d: any) => d.angle = ((d.startAngle + d.endAngle) / 2))
        //   .attr("dy", ".35em")
        //   .attr("class", "titles")
        //   .attr("text-anchor", (d: any) => d.angle > Math.PI ? "end" : null)
        //   .attr("transform", (d: any) => "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
        //     + "translate(" + (this.innerRadius + 55) + ")"
        //     + (d.angle > Math.PI ? "rotate(180)" : ""))
        //   .text((d: any) => this.Names[d.index]);


        this.chords = this.wrapper.selectAll("path.chord")
            .data(this.chord.chords)
            .enter().append("path")
            .attr("class", "chord")
            .style("stroke", "none")
            .style("fill", (d: any) => this.color(d.target.index))
            .style("opacity", 1)
            .attr("d", this.path)
            .on("mouseover", (data) => { this.fadeChord(0.05, 0.05, data); })
            .on("mouseout", (data) => { this.fadeChord(1, 0.9, data) });

        this.g.append("title")
            .text((d: any) => Math.round(d.value) + " people in " + this.Names[d.index]);

        this.chords.append("title")
            .text(
            (d: any) => Math.round(d.source.value) + " people from " + this.Names[d.target.index] + " to " + this.Names[d.source.index]
            );

    }

    fade(opacity, visibility) {
        //alert(JSON.stringify(visibility))
        this.chords
            .filter((d: any) => d.source.index != visibility.index && d.target.index != visibility.index
            )
            .transition()
            .style("opacity", opacity);
    }

    fadeChord(opacityArcs, opacityChords, visibility) {
        //alert(JSON.stringify(visibility))

        this.chords
            .filter((d: any, j: any) => j != (visibility.source.subindex + visibility.target.subindex)) //j!=visibility.source.subindex || j!= visibility.target.index
            .transition()
            .style("opacity", opacityChords);

    }

    private initPie() {
        this.pieColor = d3Scale.scaleOrdinal()
            .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
        this.pieArc = d3Shape.arc()
            .outerRadius(this.radius - 10)
            .innerRadius(0);
        this.labelArc = d3Shape.arc()
            .outerRadius(this.radius - 40)
            .innerRadius(this.radius - 40);
        this.pie = d3Shape.pie()
            .sort(null)
            .value((d: any) => d.population);
        this.pieSvg = d3.select("#charts").append("svg")
            .attr("width", (this.pieWidth + this.margin.left + this.margin.right))
            .attr("height", (this.pieHeight + this.margin.top + this.margin.bottom))
            //.style("padding", "85px")
            //.style("margin-top","62px")
            .append("g")
            .attr("transform", "translate(" + this.pieWidth / 2 + "," + this.pieHeight / 2 + ")");
        //this.wrapper = this.svg.append("g").attr("class", "pieWrapper")
        //    .attr("transform", "translate(" + (this.pieWidth / 2 + this.margin.left) + "," + (this.pieHeight / 2 + this.margin.top) + ")");
    }

    private drawPie() {
        let g = this.pieSvg.selectAll(".arc")
            .data(this.pie(Stats))
            .enter().append("g")
            .attr("class", "arc");
        g.append("path").attr("d", this.pieArc)
            .style("fill", (d: any) => this.pieColor(d.data.age));
        g.append("text").attr("transform", (d: any) => "translate(" + this.labelArc.centroid(d) + ")")
            .attr("dy", ".35em")
            .text((d: any) => d.data.age);
    }

}